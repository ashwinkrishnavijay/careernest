package com.careernest.service;

import com.careernest.dto.JobRequest;
import com.careernest.dto.JobResponse;
import com.careernest.model.Job;
import com.careernest.model.User;
import com.careernest.repository.ApplicationRepository;
import com.careernest.repository.JobRepository;
import com.careernest.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final TwilioSmsService smsService;

    public JobService(JobRepository jobRepository,
                      ApplicationRepository applicationRepository,
                      UserRepository userRepository,
                      TwilioSmsService smsService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.smsService = smsService;
    }

    public List<JobResponse> getAllJobs(String keyword, String location, String currentUserEmail) {
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : "";
        String loc = (location != null && !location.isBlank()) ? location.trim() : "";

        List<Job> jobs;
        if (!kw.isBlank() || !loc.isBlank()) {
            jobs = jobRepository.searchJobs(kw, loc);
        } else {
            jobs = jobRepository.findByActiveTrueOrderByCreatedAtDesc();
        }

        User currentUser = null;
        if (currentUserEmail != null && !currentUserEmail.isBlank()) {
            currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
        }
        final User user = currentUser;

        return jobs.stream().map(job -> {
            long count = applicationRepository.countByJobId(job.getId());
            boolean applied = (user != null) && applicationRepository.existsByJobIdAndSeekerId(job.getId(), user.getId());
            return JobResponse.fromJob(job, count, applied);
        }).collect(Collectors.toList());
    }

    public JobResponse getJobById(String jobId, String currentUserEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job listing not found with ID: " + jobId));

        long count = applicationRepository.countByJobId(job.getId());
        boolean applied = false;
        if (currentUserEmail != null && !currentUserEmail.isBlank()) {
            User user = userRepository.findByEmail(currentUserEmail).orElse(null);
            if (user != null) {
                applied = applicationRepository.existsByJobIdAndSeekerId(job.getId(), user.getId());
            }
        }

        return JobResponse.fromJob(job, count, applied);
    }

    public JobResponse createJob(JobRequest request, String employerEmail) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employer user not found with email: " + employerEmail));

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setDeadline(request.getDeadline());
        job.setCompany((request.getCompany() != null && !request.getCompany().isBlank())
                ? request.getCompany()
                : (employer.getCompanyName() != null ? employer.getCompanyName() : employer.getName()));
        job.setEmploymentType(request.getEmploymentType() != null ? request.getEmploymentType() : "Full-time");
        job.setRequirements(request.getRequirements());
        job.setEmployerId(employer.getId());
        job.setEmployerName(employer.getName());
        job.setEmployerEmail(employer.getEmail());
        job.setActive(true);
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());

        Job saved = jobRepository.save(job);

        // Send confirmation SMS to employer
        if (employer.getPhone() != null && !employer.getPhone().isBlank()) {
            smsService.sendJobPostingAlert(employer.getPhone(), employer.getName(), saved.getTitle());
        }

        return JobResponse.fromJob(saved, 0, false);
    }

    public JobResponse updateJob(String jobId, JobRequest request, String employerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));

        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employer user not found"));

        if (!job.getEmployerId().equals(employer.getId())) {
            throw new AccessDeniedException("You are not authorized to update this job listing");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setDeadline(request.getDeadline());
        if (request.getCompany() != null && !request.getCompany().isBlank()) {
            job.setCompany(request.getCompany());
        }
        if (request.getEmploymentType() != null) {
            job.setEmploymentType(request.getEmploymentType());
        }
        if (request.getRequirements() != null) {
            job.setRequirements(request.getRequirements());
        }
        job.setUpdatedAt(LocalDateTime.now());

        Job updated = jobRepository.save(job);
        long count = applicationRepository.countByJobId(updated.getId());

        return JobResponse.fromJob(updated, count, false);
    }

    public void deleteJob(String jobId, String employerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));

        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employer user not found"));

        if (!job.getEmployerId().equals(employer.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this job listing");
        }

        // Soft delete / deactivate so applied applications don't get broken, or hard delete
        job.setActive(false);
        job.setUpdatedAt(LocalDateTime.now());
        jobRepository.save(job);
    }

    public List<JobResponse> getEmployerJobs(String employerEmail) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employer user not found"));

        List<Job> jobs = jobRepository.findByEmployerIdOrderByCreatedAtDesc(employer.getId());
        return jobs.stream().map(job -> {
            long count = applicationRepository.countByJobId(job.getId());
            return JobResponse.fromJob(job, count, false);
        }).collect(Collectors.toList());
    }
}
