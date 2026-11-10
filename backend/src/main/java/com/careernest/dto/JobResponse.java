package com.careernest.dto;

import com.careernest.model.Job;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class JobResponse {

    private String id;
    private String title;
    private String description;
    private String location;
    private String salary;
    private LocalDate deadline;
    private String company;
    private String employmentType;
    private List<String> requirements;
    private String employerId;
    private String employerName;
    private String employerEmail;
    private boolean active;
    private long applicantCount;
    private boolean appliedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JobResponse() {
    }

    public static JobResponse fromJob(Job job, long applicantCount, boolean appliedByCurrentUser) {
        JobResponse resp = new JobResponse();
        resp.setId(job.getId());
        resp.setTitle(job.getTitle());
        resp.setDescription(job.getDescription());
        resp.setLocation(job.getLocation());
        resp.setSalary(job.getSalary());
        resp.setDeadline(job.getDeadline());
        resp.setCompany(job.getCompany());
        resp.setEmploymentType(job.getEmploymentType());
        resp.setRequirements(job.getRequirements());
        resp.setEmployerId(job.getEmployerId());
        resp.setEmployerName(job.getEmployerName());
        resp.setEmployerEmail(job.getEmployerEmail());
        resp.setActive(job.isActive());
        resp.setApplicantCount(applicantCount);
        resp.setAppliedByCurrentUser(appliedByCurrentUser);
        resp.setCreatedAt(job.getCreatedAt());
        resp.setUpdatedAt(job.getUpdatedAt());
        return resp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public List<String> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }

    public String getEmployerId() {
        return employerId;
    }

    public void setEmployerId(String employerId) {
        this.employerId = employerId;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public String getEmployerEmail() {
        return employerEmail;
    }

    public void setEmployerEmail(String employerEmail) {
        this.employerEmail = employerEmail;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public long getApplicantCount() {
        return applicantCount;
    }

    public void setApplicantCount(long applicantCount) {
        this.applicantCount = applicantCount;
    }

    public boolean isAppliedByCurrentUser() {
        return appliedByCurrentUser;
    }

    public void setAppliedByCurrentUser(boolean appliedByCurrentUser) {
        this.appliedByCurrentUser = appliedByCurrentUser;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
