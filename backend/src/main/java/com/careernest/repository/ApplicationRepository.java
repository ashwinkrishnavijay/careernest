package com.careernest.repository;

import com.careernest.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {

    List<Application> findBySeekerIdOrderByAppliedAtDesc(String seekerId);

    List<Application> findByEmployerIdOrderByAppliedAtDesc(String employerId);

    List<Application> findByJobIdOrderByAppliedAtDesc(String jobId);

    boolean existsByJobIdAndSeekerId(String jobId, String seekerId);

    long countByJobId(String jobId);
}
