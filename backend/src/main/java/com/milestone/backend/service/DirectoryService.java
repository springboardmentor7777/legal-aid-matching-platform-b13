package com.milestone.backend.service;

// import com.milestone.backend.dto.ExternalLawyerDto;
// import com.milestone.backend.dto.ExternalNgoDto;
import com.milestone.backend.dto.LawyerDto;
import com.milestone.backend.dto.NgoDto;
// import com.milestone.backend.entity.LawyerDirectory;
// import com.milestone.backend.entity.NgoDirectory;
import com.milestone.backend.entity.Role;
import com.milestone.backend.entity.User;
// import com.milestone.backend.repository.LawyerDirectoryRepository;
// import com.milestone.backend.repository.NgoDirectoryRepository;
import com.milestone.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// import org.apache.poi.ss.usermodel.*;
// import org.apache.poi.xssf.usermodel.XSSFWorkbook;
// import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
// import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// import java.io.InputStream;
// import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DirectoryService {

    private final UserRepository userRepository;
    // private final LawyerDirectoryRepository lawyerRepository;
    // private final NgoDirectoryRepository ngoRepository;
    // private final RestTemplate restTemplate;

    // ══════════════════════════════════════════════════════════════════════════
    //  LAWYER — Read
    // ══════════════════════════════════════════════════════════════════════════

    public List<LawyerDto> getAllLawyers() {
        return userRepository.findAllByRole(Role.LAWYER)
                .stream()
                .map(this::mapToLawyerDto)
                .collect(Collectors.toList());
    }

    public LawyerDto getLawyerById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lawyer with ID " + id + " not found."));

        if (user.getRole() != Role.LAWYER) {
            throw new RuntimeException("Lawyer with ID " + id + " not found.");
        }
        return mapToLawyerDto(user);
    }

    public Page<LawyerDto> searchLawyers(String location, String expertise, Boolean isVerified, Pageable pageable) {
        return userRepository.searchLawyers(Role.LAWYER, location, expertise, isVerified, pageable)
                .map(this::mapToLawyerDto);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  LAWYER — External Import (merged from ExternalLawyerIntegrationService)
    // ══════════════════════════════════════════════════════════════════════════

    // public void importLawyersFromExternalApi() {

    //     String url = "https://example.com/api/lawyers"; // Replace with real Bar Council endpoint

    //     ResponseEntity<ExternalLawyerDto[]> response;

    //     try {
    //         response = restTemplate.getForEntity(url, ExternalLawyerDto[].class);
    //     } catch (Exception e) {
    //         log.error("Failed to reach external lawyer API: {}", e.getMessage(), e);
    //         return;
    //     }

    //     ExternalLawyerDto[] externalLawyers = response.getBody();

    //     if (externalLawyers == null || externalLawyers.length == 0) {
    //         log.warn("No lawyer data received from external source.");
    //         return;
    //     }

    //     for (ExternalLawyerDto dto : externalLawyers) {

    //         if (dto.getName() == null || dto.getCity() == null) {
    //             log.warn("Skipping invalid lawyer record.");
    //             continue;
    //         }

    //         String normalizedLocation = dto.getCity().trim().toUpperCase();

    //         boolean exists = lawyerRepository.existsByNameAndLocation(
    //                 dto.getName().trim(), normalizedLocation);

    //         if (!exists) {
    //             LawyerDirectory lawyer = new LawyerDirectory();
    //             lawyer.setName(dto.getName().trim());
    //             lawyer.setExpertise(dto.getPracticeArea());
    //             lawyer.setLocation(normalizedLocation);
    //             lawyer.setVerified("Verified".equalsIgnoreCase(dto.getVerificationStatus()));
    //             lawyer.setOrganizationDetails("Imported from Bar Council");

    //             lawyerRepository.save(lawyer);
    //             log.info("Saved lawyer: {}", lawyer.getName());
    //         } else {
    //             log.info("Duplicate lawyer skipped: {}", dto.getName());
    //         }
    //     }
    // }

    // ══════════════════════════════════════════════════════════════════════════
    //  NGO — Read
    // ══════════════════════════════════════════════════════════════════════════

    public List<NgoDto> getAllNgos() {
        return userRepository.findAllByRole(Role.NGO)
                .stream()
                .map(this::mapToNgoDto)
                .collect(Collectors.toList());
    }

    public NgoDto getNgoById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NGO with ID " + id + " not found."));

        if (user.getRole() != Role.NGO) {
            throw new RuntimeException("NGO with ID " + id + " not found.");
        }
        return mapToNgoDto(user);
    }

    public Page<NgoDto> searchNgos(String location, Boolean isVerified, Pageable pageable) {
        return userRepository.searchNgos(Role.NGO, location, isVerified, pageable)
                .map(this::mapToNgoDto);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  NGO — External Import (merged from ExternalNgoIntegrationService)
    // ══════════════════════════════════════════════════════════════════════════

    // public void importNgosFromExcel() {

    //     log.info("importNgosFromExcel() called.");

    //     List<ExternalNgoDto> externalNgos = readNgosFromExcel("ngo_data.xlsx");

    //     if (externalNgos.isEmpty()) {
    //         log.warn("No NGO data found in Excel file.");
    //         return;
    //     }

    //     for (ExternalNgoDto dto : externalNgos) {

    //         if (dto.getOrg_name() == null || dto.getCity() == null) {
    //             log.warn("Skipping invalid NGO record.");
    //             continue;
    //         }

    //         String normalizedLocation = dto.getCity().trim().toUpperCase();

    //         boolean exists = ngoRepository.existsByNameAndLocation(
    //                 dto.getOrg_name().trim(), normalizedLocation);

    //         if (!exists) {
    //             NgoDirectory ngo = new NgoDirectory();
    //             ngo.setName(dto.getOrg_name().trim());
    //             ngo.setExpertise(dto.getFocus_area());
    //             ngo.setLocation(normalizedLocation);
    //             ngo.setVerified("Registered".equalsIgnoreCase(dto.getRegistration_status()));
    //             ngo.setOrganizationDetails("Imported from NGO Darpan");

    //             ngoRepository.save(ngo);
    //             log.info("Saved NGO: {}", ngo.getName());
    //         } else {
    //             log.info("Duplicate NGO skipped: {}", dto.getOrg_name());
    //         }
    //     }
    // }
    public User toggleLawyerAvailability(Long lawyerId) {
        User user = userRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));

        if (user.getRole() != Role.LAWYER || user.getLawyerProfile() == null) {
            throw new RuntimeException("Lawyer profile not found");
        }

        Boolean current = user.getLawyerProfile().getIsAvailable();
        user.getLawyerProfile().setIsAvailable(current == null ? true : !current);

        return userRepository.save(user);
    }

    public User toggleNgoAvailability(Long ngoId) {
        User user = userRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (user.getRole() != Role.NGO || user.getNgoProfile() == null) {
            throw new RuntimeException("NGO profile not found");
        }

        Boolean current = user.getNgoProfile().getIsAvailable();
        user.getNgoProfile().setIsAvailable(current == null ? true : !current);

        return userRepository.save(user);
    }


    // ══════════════════════════════════════════════════════════════════════════
    //  Private Helpers
    // ══════════════════════════════════════════════════════════════════════════

    // private List<ExternalNgoDto> readNgosFromExcel(String filename) {

    //     List<ExternalNgoDto> result = new ArrayList<>();

    //     try (InputStream is = new ClassPathResource(filename).getInputStream();
    //          Workbook workbook = new XSSFWorkbook(is)) {

    //         Sheet sheet = workbook.getSheetAt(0);

    //         for (int i = 1; i <= sheet.getLastRowNum(); i++) {
    //             Row row = sheet.getRow(i);
    //             if (row == null) continue;

    //             ExternalNgoDto dto = new ExternalNgoDto();
    //             dto.setOrg_name(getCellValue(row, 0));
    //             dto.setCity(getCellValue(row, 1));
    //             dto.setFocus_area(getCellValue(row, 2));
    //             dto.setRegistration_status(getCellValue(row, 3));

    //             result.add(dto);
    //         }

    //         log.info("Loaded {} NGO records from Excel.", result.size());

    //     } catch (Exception e) {
    //         log.error("Failed to read Excel file: {}", e.getMessage(), e);
    //     }

    //     return result;
    // }

    // private String getCellValue(Row row, int colIndex) {
    //     Cell cell = row.getCell(colIndex, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
    //     if (cell == null) return null;

    //     return switch (cell.getCellType()) {
    //         case STRING  -> cell.getStringCellValue().trim();
    //         case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
    //         case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
    //         default      -> null;
    //     };
    // }

    private LawyerDto mapToLawyerDto(User user) {
        LawyerDto.LawyerDtoBuilder builder = LawyerDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .isVerified(user.getIsVerified());

        if (user.getLawyerProfile() != null) {
            builder.specialization(user.getLawyerProfile().getSpecialization());
            builder.experience(user.getLawyerProfile().getExperience());
            builder.location(user.getLawyerProfile().getLocation());
            builder.isAvailable(user.getLawyerProfile().getIsAvailable());
        }
        return builder.build();
    }

    private NgoDto mapToNgoDto(User user) {
        NgoDto.NgoDtoBuilder builder = NgoDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .isVerified(user.getIsVerified());

        if (user.getNgoProfile() != null) {
            builder.organizationName(user.getNgoProfile().getOrganizationName());
            builder.serviceArea(user.getNgoProfile().getServiceArea());
            builder.isAvailable(user.getNgoProfile().getIsAvailable());
        }
        return builder.build();
    }
}
