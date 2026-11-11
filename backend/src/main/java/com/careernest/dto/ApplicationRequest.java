package com.careernest.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplicationRequest {

    private String coverLetter;

    private String resumeUrl;

    @NotBlank(message = "Contact phone number is required for SMS application updates")
    private String phone;

    public ApplicationRequest() {
    }

    public ApplicationRequest(String coverLetter, String resumeUrl, String phone) {
        this.coverLetter = coverLetter;
        this.resumeUrl = resumeUrl;
        this.phone = phone;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
