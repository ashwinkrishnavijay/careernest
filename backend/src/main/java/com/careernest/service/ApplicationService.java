package com.careernest.service;

import com.careernest.dto.ApplicationRequest;
import com.careernest.dto.ApplicationResponse;
import com.careernest.dto.ApplicationStatusUpdate;
import com.careernest.model.Application;
import com.careernest.model.ApplicationStatus;
import com.careernest.model.Job;
import com.careernest.model.User;
import com.careernest.repository.ApplicationRepository;
import com.careernest.repository.JobRepository;
import com.careernest.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final TwilioSmsService smsService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              TwilioSmsService smsService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.smsService = smsService;
    }

    public ApplicationResponse applyForJob(String jobId, ApplicationRequest request, String seekerEmail) {
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + seekerEmail));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));

        if (!job.isActive()) {
            throw new IllegalStateException("This job listing is no longer active");
        }

        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDate.now())) {
            throw new IllegalStateException("The application deadline for this job has passed (" + job.getDeadline() + ")");
        }

        if (applicationRepository.existsByJobIdAndSeekerId(jobId, seeker.getId())) {
            throw new IllegalStateException("You have already submitted an application for this job");
        }

        String phone = (request.getPhone() != null && !request.getPhone().isBlank())
                ? request.getPhone()
                : seeker.getPhone();

        Application application = new Application();
        application.setJobId(job.getId());
        application.setJobTitle(job.getTitle());
        application.setJobCompany(job.getCompany());
        application.setEmployerId(job.getEmployerId());
        application.setSeekerId(seeker.getId());
        application.setSeekerName(seeker.getName());
        application.setSeekerEmail(seeker.getEmail());
        application.setSeekerPhone(phone);
        application.setCoverLetter(request.getCoverLetter());
        application.setResumeUrl(request.getResumeUrl());
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        // 1. Send SMS confirmation to Job Seeker
        if (phone != null && !phone.isBlank()) {
            smsService.sendApplicationSubmittedSeeker(phone, seeker.getName(), job.getTitle(), job.getCompany());
        }

        // 2. Send SMS alert to Employer
        userRepository.findById(job.getEmployerId()).ifPresent(employer -> {
            if (employer.getPhone() != null && !employer.getPhone().isBlank()) {
                smsService.sendApplicationReceivedEmployer(employer.getPhone(), employer.getName(), job.getTitle(), seeker.getName());
            }
        });

        return ApplicationResponse.fromApplication(saved);
    }

    public List<ApplicationResponse> getSeekerApplications(String seekerEmail) {
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Seeker user not found"));

        return applicationRepository.findBySeekerIdOrderByAppliedAtDesc(seeker.getId())
                .stream()
                .map(ApplicationResponse::fromApplication)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getEmployerApplications(String employerEmail, String jobId) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employer user not found"));

        List<Application> apps;
        if (jobId != null && !jobId.isBlank()) {
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new IllegalArgumentException("Job not found"));
            if (!job.getEmployerId().equals(employer.getId())) {
                throw new AccessDeniedException("Not authorized to view applicants for this job");
            }
            apps = applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
        } else {
            apps = applicationRepository.findByEmployerIdOrderByAppliedAtDesc(employer.getId());
        }

        return apps.stream()
                .map(ApplicationResponse::fromApplication)
                .collect(Collectors.toList());
    }

    public ApplicationResponse updateApplicationStatus(String applicationId, ApplicationStatusUpdate updateReq, String employerEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + applicationId));

        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employer user not found"));

        if (!application.getEmployerId().equals(employer.getId())) {
            throw new AccessDeniedException("Not authorized to update this application");
        }

        application.setStatus(updateReq.getStatus());
        if (updateReq.getNotes() != null) {
            application.setEmployerNotes(updateReq.getNotes());
        }
        application.setUpdatedAt(LocalDateTime.now());

        Application updated = applicationRepository.save(application);

        // Send SMS notification to Seeker regarding status update
        if (updated.getSeekerPhone() != null && !updated.getSeekerPhone().isBlank()) {
            smsService.sendApplicationStatusUpdate(
                    updated.getSeekerPhone(),
                    updated.getSeekerName(),
                    updated.getJobTitle(),
                    updated.getJobCompany(),
                    updated.getStatus().name(),
                    updated.getEmployerNotes()
            );
        }

        return ApplicationResponse.fromApplication(updated);
    }
}
