package com.milestone.backend.service;

import com.milestone.backend.dto.ExternalNgoDto;
import com.milestone.backend.entity.NgoDirectory;
import com.milestone.backend.repository.NgoDirectoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@Service
@RequiredArgsConstructor  // ✅ this injects ngoRepository automatically — DO NOT add = null
@Slf4j
public class ExternalNgoIntegrationService {

    // ✅ just declare it — @RequiredArgsConstructor handles injection
    private final NgoDirectoryRepository ngoRepository;

    public void fetchAndSaveNgos() {

        log.info("fetchAndSaveNgos() called.");

        List<ExternalNgoDto> externalNgos = readFromExcel("ngo_data.xlsx");

        if (externalNgos.isEmpty()) {
            log.warn("No NGO data found in Excel file.");
            return;
        }

        for (ExternalNgoDto dto : externalNgos) {

            if (dto.getOrg_name() == null || dto.getCity() == null) {
                log.warn("Skipping invalid NGO record.");
                continue;
            }

            String normalizedLocation = dto.getCity().trim().toUpperCase();

            boolean exists = ngoRepository.existsByNameAndLocation(
                    dto.getOrg_name().trim(),
                    normalizedLocation
            );

            if (!exists) {
                NgoDirectory ngo = new NgoDirectory();
                ngo.setName(dto.getOrg_name().trim());
                ngo.setExpertise(dto.getFocus_area());
                ngo.setLocation(normalizedLocation);
                ngo.setVerified("Registered".equalsIgnoreCase(dto.getRegistration_status()));
                ngo.setOrganizationDetails("Imported from NGO Darpan");

                ngoRepository.save(ngo);
                log.info("Saved NGO: {}", ngo.getName());

            } else {
                log.info("Duplicate NGO skipped: {}", dto.getOrg_name());
            }
        }
    }

    private List<ExternalNgoDto> readFromExcel(String fileName) {

        List<ExternalNgoDto> result = new ArrayList<>();

        try (InputStream is = new ClassPathResource(fileName).getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                ExternalNgoDto dto = new ExternalNgoDto();
                dto.setOrg_name(getCellValue(row, 0));
                dto.setCity(getCellValue(row, 1));
                dto.setFocus_area(getCellValue(row, 2));
                dto.setRegistration_status(getCellValue(row, 3));

                result.add(dto);
            }

            log.info("Loaded {} NGO records from Excel.", result.size());

        } catch (Exception e) {
            log.error("Failed to read Excel file: {}", e.getMessage(), e);
        }

        return result;
    }

    private String getCellValue(Row row, int colIndex) {
        Cell cell = row.getCell(colIndex, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        if (cell == null) return null;

        return switch (cell.getCellType()) {
            case STRING  -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default      -> null;
        };
    }
}
