package com.careernest.dto;

import com.careernest.model.Application;
import com.careernest.model.ApplicationStatus;

import java.time.LocalDateTime;

public class ApplicationResponse {

    private String id;
    private String jobId;
    private String jobTitle;
    private String jobCompany;
    private String employerId;
    private String seekerId;
    private String seekerName;
    private String seekerEmail;
    private String seekerPhone;
    private String coverLetter;
    private String resumeUrl;
    private ApplicationStatus status;
    private String employerNotes;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public ApplicationResponse() {
    }

    public static ApplicationResponse fromApplication(Application app) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(app.getId());
        resp.setJobId(app.getJobId());
        resp.setJobTitle(app.getJobTitle());
        resp.setJobCompany(app.getJobCompany());
        resp.setEmployerId(app.getEmployerId());
        resp.setSeekerId(app.getSeekerId());
        resp.setSeekerName(app.getSeekerName());
        resp.setSeekerEmail(app.getSeekerEmail());
        resp.setSeekerPhone(app.getSeekerPhone());
        resp.setCoverLetter(app.getCoverLetter());
        resp.setResumeUrl(app.getResumeUrl());
        resp.setStatus(app.getStatus());
        resp.setEmployerNotes(app.getEmployerNotes());
        resp.setAppliedAt(app.getAppliedAt());
        resp.setUpdatedAt(app.getUpdatedAt());
        return resp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobCompany() {
        return jobCompany;
    }

    public void setJobCompany(String jobCompany) {
        this.jobCompany = jobCompany;
    }

    public String getEmployerId() {
        return employerId;
    }

    public void setEmployerId(String employerId) {
        this.employerId = employerId;
    }

    public String getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(String seekerId) {
        this.seekerId = seekerId;
    }

    public String getSeekerName() {
        return seekerName;
    }

    public void setSeekerName(String seekerName) {
        this.seekerName = seekerName;
    }

    public String getSeekerEmail() {
        return seekerEmail;
    }

    public void setSeekerEmail(String seekerEmail) {
        this.seekerEmail = seekerEmail;
    }

    public String getSeekerPhone() {
        return seekerPhone;
    }

    public void setSeekerPhone(String seekerPhone) {
        this.seekerPhone = seekerPhone;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getEmployerNotes() {
        return employerNotes;
    }

    public void setEmployerNotes(String employerNotes) {
        this.employerNotes = employerNotes;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
