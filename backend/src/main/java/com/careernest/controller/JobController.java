package com.careernest.controller;

import com.careernest.dto.ApiResponse;
import com.careernest.dto.JobRequest;
import com.careernest.dto.JobResponse;
import com.careernest.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Public / All: Search and browse jobs
    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            Authentication authentication) {
        String currentUserEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        List<JobResponse> jobs = jobService.getAllJobs(keyword, location, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.ok("Job listings retrieved", jobs));
    }

    // Public / All: View specific job details
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(
            @PathVariable String id,
            Authentication authentication) {
        String currentUserEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        JobResponse job = jobService.getJobById(id, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.ok("Job details retrieved", job));
    }

    // Employer only: Post a new job
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        JobResponse created = jobService.createJob(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job listing created successfully and notification dispatched", created));
    }

    // Employer only: Update job listing
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable String id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        JobResponse updated = jobService.updateJob(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Job listing updated successfully", updated));
    }

    // Employer only: Remove job listing
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable String id,
            Authentication authentication) {
        jobService.deleteJob(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Job listing removed successfully"));
    }

    // Employer only: Get my posted jobs
    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyPostedJobs(Authentication authentication) {
        List<JobResponse> jobs = jobService.getEmployerJobs(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Employer job listings retrieved", jobs));
    }
}
