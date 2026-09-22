package com.placementhub.backend.service;

import com.placementhub.backend.dto.CompanyDto;
import java.util.List;

public interface CompanyService {
    CompanyDto createCompany(CompanyDto companyDto);
    CompanyDto getCompanyById(Long companyId);
    List<CompanyDto> getAllCompanies();
    CompanyDto updateCompany(Long companyId, CompanyDto companyDto);
    void deleteCompany(Long companyId);
}
