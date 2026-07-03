package com.jobapp.backend.controller;

import com.jobapp.backend.model.JobApplicationModel;
import com.jobapp.backend.model.UserProfile;
import com.jobapp.backend.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing job search operations, matching analysis,
 * and AI-enabled job application submissions.
 * Communicates with the React/Vite front-end over HTTP REST endpoints.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class JobRestController {

    private final JobApplicationService applicationService;

    @Autowired
    public JobRestController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * POST /api/jobs/apply
     * Submits a candidate profile along with their tailored cover letter to the hiring queue.
     */
    @PostMapping("/jobs/apply")
    public ResponseEntity<?> applyToJob(@RequestBody Map<String, Object> payload) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> jobData = (Map<String, Object>) payload.get("job");
            @SuppressWarnings("unchecked")
            Map<String, Object> profileData = (Map<String, Object>) payload.get("profile");
            String coverLetter = (String) payload.get("coverLetter");

            if (jobData == null || profileData == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Missing job or candidate profile information."));
            }

            JobApplicationModel application = applicationService.submitApplication(jobData, profileData, coverLetter);
            return ResponseEntity.ok(Map.of("success", true, "application", application));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during application processing: " + e.getMessage()));
        }
    }

    /**
     * GET /api/applications
     * Retrieves the history of submitted applications.
     */
    @GetMapping("/applications")
    public ResponseEntity<List<JobApplicationModel>> getSubmittedApplications() {
        List<JobApplicationModel> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    /**
     * POST /api/ai/analyze-match
     * Proxies match analysis requests to the Gemini Integration Service.
     */
    @PostMapping("/ai/analyze-match")
    public ResponseEntity<?> analyzeJobMatch(@RequestBody Map<String, Object> payload) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> jobData = (Map<String, Object>) payload.get("job");
            @SuppressWarnings("unchecked")
            Map<String, Object> profileData = (Map<String, Object>) payload.get("profile");

            if (jobData == null || profileData == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Missing job description or profile data."));
            }

            Map<String, Object> analysis = applicationService.analyzeMatch(jobData, profileData);
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to run AI match analysis: " + e.getMessage()));
        }
    }

    /**
     * POST /api/ai/generate-application
     * Triggers cover letter generation and resume optimizer via Gemini model.
     */
    @PostMapping("/ai/generate-application")
    public ResponseEntity<?> generateApplicationMaterials(@RequestBody Map<String, Object> payload) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> jobData = (Map<String, Object>) payload.get("job");
            @SuppressWarnings("unchecked")
            Map<String, Object> profileData = (Map<String, Object>) payload.get("profile");
            String customInstructions = (String) payload.get("customRequest");

            if (jobData == null || profileData == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Missing job description or candidate profile."));
            }

            Map<String, Object> materials = applicationService.generateTailoredMaterials(jobData, profileData, customInstructions);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "AI materials generation failed: " + e.getMessage()));
        }
    }
}
