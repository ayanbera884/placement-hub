package com.placementhub.backend.repository;

import com.placementhub.backend.entity.EmploymentType;
import com.placementhub.backend.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:skill IS NULL OR LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :skill, '%'))) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType)")
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("skill") String skill,
            @Param("employmentType") EmploymentType employmentType,
            Pageable pageable
    );
}
