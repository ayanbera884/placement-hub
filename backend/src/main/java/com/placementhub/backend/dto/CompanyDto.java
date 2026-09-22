package com.placementhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {
    private Long id;

    @NotBlank(message = "Company name is required")
    private String name;

    private String description;
    private String website;
    private String location;
    private String industry;
    private String logo;
    private String companySize;
}
