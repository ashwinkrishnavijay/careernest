package com.careernest.seeder;

import com.careernest.model.Job;
import com.careernest.model.Role;
import com.careernest.model.User;
import com.careernest.repository.JobRepository;
import com.careernest.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          JobRepository jobRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Database is empty. Seeding initial demo users and jobs...");

            // 1. Seed Demo Employer
            User employer = new User();
            employer.setName("Sarah Jenkins");
            employer.setEmail("employer@careernest.com");
            employer.setPassword(passwordEncoder.encode("password123"));
            employer.setPhone("+15550198234");
            employer.setRole(Role.EMPLOYER);
            employer.setCompanyName("TechCorp Global");
            employer.setCompanyWebsite("https://techcorp.example.com");
            employer.setCreatedAt(LocalDateTime.now());
            employer.setUpdatedAt(LocalDateTime.now());
            User savedEmployer = userRepository.save(employer);

            // 2. Seed Demo Job Seeker
            User seeker = new User();
            seeker.setName("Alex Rivera");
            seeker.setEmail("seeker@careernest.com");
            seeker.setPassword(passwordEncoder.encode("password123"));
            seeker.setPhone("+15550143892");
            seeker.setRole(Role.JOB_SEEKER);
            seeker.setHeadline("Full Stack Software Engineer & Cloud Enthusiast");
            seeker.setSkills(Arrays.asList("Java", "Spring Boot", "React", "TypeScript", "MongoDB", "Docker"));
            seeker.setResumeUrl("https://example.com/alex-rivera-resume.pdf");
            seeker.setCreatedAt(LocalDateTime.now());
            seeker.setUpdatedAt(LocalDateTime.now());
            userRepository.save(seeker);

            // 3. Seed Sample Jobs
            Job job1 = new Job();
            job1.setTitle("Senior Full Stack Java Developer");
            job1.setDescription("Looking for an experienced Full Stack Engineer with strong Spring Boot and React skills to lead the development of our enterprise cloud services.");
            job1.setLocation("San Francisco, CA (Remote)");
            job1.setSalary("$135,000 - $165,000 / year");
            job1.setDeadline(LocalDate.now().plusMonths(2));
            job1.setCompany("TechCorp Global");
            job1.setEmploymentType("Full-time");
            job1.setRequirements(List.of("5+ years of Java / Spring Boot", "Proficiency with React & TypeScript", "Experience with MongoDB and microservices", "Strong system design skills"));
            job1.setEmployerId(savedEmployer.getId());
            job1.setEmployerName(savedEmployer.getName());
            job1.setEmployerEmail(savedEmployer.getEmail());
            job1.setActive(true);
            job1.setCreatedAt(LocalDateTime.now().minusDays(3));
            job1.setUpdatedAt(LocalDateTime.now().minusDays(3));

            Job job2 = new Job();
            job2.setTitle("Frontend React & TypeScript Specialist");
            job2.setDescription("Join our design-forward product engineering team to build high-performance web applications using TailwindCSS, React 18, and modern state management.");
            job2.setLocation("New York, NY (Hybrid)");
            job2.setSalary("$110,000 - $140,000 / year");
            job2.setDeadline(LocalDate.now().plusMonths(1));
            job2.setCompany("TechCorp Global");
            job2.setEmploymentType("Full-time");
            job2.setRequirements(List.of("3+ years React & TypeScript", "TailwindCSS and responsive UI mastery", "State management with Redux Toolkit", "REST API integration"));
            job2.setEmployerId(savedEmployer.getId());
            job2.setEmployerName(savedEmployer.getName());
            job2.setEmployerEmail(savedEmployer.getEmail());
            job2.setActive(true);
            job2.setCreatedAt(LocalDateTime.now().minusDays(1));
            job2.setUpdatedAt(LocalDateTime.now().minusDays(1));

            Job job3 = new Job();
            job3.setTitle("Cloud Infrastructure & DevOps Engineer");
            job3.setDescription("Help scale our deployment pipelines and cloud infrastructure across AWS and containerized environments.");
            job3.setLocation("Austin, TX (Remote)");
            job3.setSalary("$125,000 - $155,000 / year");
            job3.setDeadline(LocalDate.now().plusWeeks(3));
            job3.setCompany("TechCorp Global");
            job3.setEmploymentType("Full-time");
            job3.setRequirements(List.of("Docker & Kubernetes", "CI/CD automation", "AWS or GCP experience", "Terraform & Linux scripting"));
            job3.setEmployerId(savedEmployer.getId());
            job3.setEmployerName(savedEmployer.getName());
            job3.setEmployerEmail(savedEmployer.getEmail());
            job3.setActive(true);
            job3.setCreatedAt(LocalDateTime.now());
            job3.setUpdatedAt(LocalDateTime.now());

            jobRepository.saveAll(Arrays.asList(job1, job2, job3));
            log.info("Database seeding complete: 2 users and 3 jobs created.");
        }
    }
}
