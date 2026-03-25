package com.milestone.backend.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;

import com.milestone.backend.entity.ExternalLawyers;

@Service
public class LawyerExcelService {

    public List<ExternalLawyers> parseLawyerExcel(InputStream is){
        List<ExternalLawyers> lawyers = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                if (row == null) continue;

                ExternalLawyers lawyer = new ExternalLawyers();

                lawyer.setName(getCellValue(row.getCell(0)));
                lawyer.setEmail(getCellValue(row.getCell(1)));
                lawyer.setExperience(getCellValue(row.getCell(2)));
                lawyer.setExpertise(getCellValue(row.getCell(3)));
                lawyer.setLocation(getCellValue(row.getCell(4)));
                lawyer.setIsVerified(getCellValue(row.getCell(5)));

                lawyers.add(lawyer);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file", e);
        }



        return lawyers;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return null;

        if (cell.getCellType() == CellType.STRING)
            return cell.getStringCellValue();

        if (cell.getCellType() == CellType.NUMERIC)
            return String.valueOf(cell.getNumericCellValue());

        return null;
    }
    
}
