package com.careernest.repository;

import com.careernest.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {

    List<Job> findByActiveTrueOrderByCreatedAtDesc();

    List<Job> findByEmployerIdOrderByCreatedAtDesc(String employerId);

    // Search jobs matching keyword in title, description, or company AND matching location
    @Query("{ 'active': true, " +
           "$and: [ " +
           "  { $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } }, { 'company': { $regex: ?0, $options: 'i' } } ] }, " +
           "  { 'location': { $regex: ?1, $options: 'i' } } " +
           "] }")
    List<Job> searchJobs(String keywordRegex, String locationRegex);
}
