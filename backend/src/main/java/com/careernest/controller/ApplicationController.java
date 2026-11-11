package com.careernest.controller;

import com.careernest.dto.ApiResponse;
import com.careernest.dto.ApplicationRequest;
import com.careernest.dto.ApplicationResponse;
import com.careernest.dto.ApplicationStatusUpdate;
import com.careernest.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Job Seeker: Apply for a job
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForJob(
            @PathVariable String jobId,
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {
        ApplicationResponse response = applicationService.applyForJob(jobId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Application submitted successfully. SMS confirmation sent.", response));
    }

    // Job Seeker: View all applications submitted by logged-in seeker
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications(Authentication authentication) {
        List<ApplicationResponse> responses = applicationService.getSeekerApplications(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Candidate applications retrieved", responses));
    }

    // Employer: View all applications for their jobs (optionally filtered by jobId)
    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getEmployerApplications(
            @RequestParam(required = false) String jobId,
            Authentication authentication) {
        List<ApplicationResponse> responses = applicationService.getEmployerApplications(authentication.getName(), jobId);
        return ResponseEntity.ok(ApiResponse.ok("Job applications retrieved for employer", responses));
    }

    // Employer: Update application status (e.g., REVIEWING, SHORTLISTED, REJECTED, ACCEPTED)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @PathVariable String id,
            @Valid @RequestBody ApplicationStatusUpdate statusUpdate,
            Authentication authentication) {
        ApplicationResponse response = applicationService.updateApplicationStatus(id, statusUpdate, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Application status updated and SMS notification sent to candidate", response));
    }
}
