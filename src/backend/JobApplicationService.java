package com.jobapp.backend.service;

import com.jobapp.backend.model.JobApplicationModel;
import com.jobapp.backend.service.GeminiIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service class that implements core business rules for validating, submitting,
 * and analyzing candidate job applications.
 */
@Service
public class JobApplicationService {

    private final GeminiIntegrationService geminiService;
    private final List<JobApplicationModel> inMemoryDb = new ArrayList<>();

    @Autowired
    public JobApplicationService(GeminiIntegrationService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * Records a new job application in the pipeline database.
     */
    public synchronized JobApplicationModel submitApplication(Map<String, Object> jobData, Map<String, Object> profileData, String coverLetter) {
        String jobId = (String) jobData.get("id");
        String candidateEmail = (String) profileData.get("email");

        // Guard against duplicate application submissions
        boolean alreadyApplied = inMemoryDb.stream()
                .anyMatch(app -> app.getJobId().equals(jobId) && app.getCandidateEmail().equals(candidateEmail));

        if (alreadyApplied) {
            throw new IllegalArgumentException("You have already applied for this job listing!");
        }

        JobApplicationModel app = new JobApplicationModel();
        app.setId("app-" + UUID.randomUUID().toString().substring(0, 8));
        app.setJobId(jobId);
        app.setJobTitle((String) jobData.get("title"));
        app.setCompanyName((String) jobData.get("company"));
        app.setCandidateName((String) profileData.get("name"));
        app.setCandidateEmail(candidateEmail);
        app.setCoverLetter(coverLetter != null ? coverLetter : "");
        app.setAppliedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        app.setStatus("Submitted");

        inMemoryDb.add(0, app);
        return app;
    }

    /**
     * Retrieves all successfully submitted applications.
     */
    public List<JobApplicationModel> getAllApplications() {
        return new ArrayList<>(inMemoryDb);
    }

    /**
     * Conducts a detailed AI match analysis between profile skills and job descriptions.
     */
    public Map<String, Object> analyzeMatch(Map<String, Object> jobData, Map<String, Object> profileData) {
        return geminiService.generateMatchAnalysis(jobData, profileData);
    }

    /**
     * Generates tailored assets (cover letters, optimized bullets, outreach letters) using Gemini.
     */
    public Map<String, Object> generateTailoredMaterials(Map<String, Object> jobData, Map<String, Object> profileData, String customRequest) {
        return geminiService.generateTailoredMaterials(jobData, profileData, customRequest);
    }
}
