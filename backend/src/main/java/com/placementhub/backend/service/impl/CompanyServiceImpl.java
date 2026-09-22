package com.placementhub.backend.service.impl;

import com.placementhub.backend.dto.CompanyDto;
import com.placementhub.backend.entity.Company;
import com.placementhub.backend.exception.ResourceNotFoundException;
import com.placementhub.backend.repository.CompanyRepository;
import com.placementhub.backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    public CompanyDto createCompany(CompanyDto companyDto) {
        if(companyRepository.existsByName(companyDto.getName())) {
            throw new RuntimeException("Company name already exists");
        }
        Company company = mapToEntity(companyDto);
        Company savedCompany = companyRepository.save(company);
        return mapToDto(savedCompany);
    }

    @Override
    public CompanyDto getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
        return mapToDto(company);
    }

    @Override
    public List<CompanyDto> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return companies.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public CompanyDto updateCompany(Long companyId, CompanyDto companyDto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        company.setName(companyDto.getName());
        company.setDescription(companyDto.getDescription());
        company.setWebsite(companyDto.getWebsite());
        company.setLocation(companyDto.getLocation());
        company.setIndustry(companyDto.getIndustry());
        company.setLogo(companyDto.getLogo());
        company.setCompanySize(companyDto.getCompanySize());

        Company updatedCompany = companyRepository.save(company);
        return mapToDto(updatedCompany);
    }

    @Override
    public void deleteCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
        companyRepository.delete(company);
    }

    private Company mapToEntity(CompanyDto dto) {
        Company entity = new Company();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setWebsite(dto.getWebsite());
        entity.setLocation(dto.getLocation());
        entity.setIndustry(dto.getIndustry());
        entity.setLogo(dto.getLogo());
        entity.setCompanySize(dto.getCompanySize());
        return entity;
    }

    private CompanyDto mapToDto(Company entity) {
        CompanyDto dto = new CompanyDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setWebsite(entity.getWebsite());
        dto.setLocation(entity.getLocation());
        dto.setIndustry(entity.getIndustry());
        dto.setLogo(entity.getLogo());
        dto.setCompanySize(entity.getCompanySize());
        return dto;
    }
}
