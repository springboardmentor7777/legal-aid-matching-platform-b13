package com.milestone.backend.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
// import org.apache.poi.sl.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;

// import com.milestone.backend.entity.ExternalLawyers;
import com.milestone.backend.entity.ExternalNGOs;

@Service
public class NGOsExcelService {

    public List<ExternalNGOs> parseNGOExcelData(InputStream is){
        List<ExternalNGOs> ngos = new ArrayList<>();

        // List<ExternalLawyers> ngos = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                if (row == null) continue;

                ExternalNGOs ngo = new ExternalNGOs();

                ngo.setName(getCellValue(row.getCell(0)));
                ngo.setEmail(getCellValue(row.getCell(1)));
                ngo.setOrganizationName(getCellValue(row.getCell(2)));
                ngo.setLocation(getCellValue(row.getCell(3)));
                ngo.setServiceLocation(getCellValue(row.getCell(4)));
                ngo.setIsVerified(getCellValue(row.getCell(5)));
                
                ngos.add(ngo);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file", e);
        }



        return ngos;

        
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
