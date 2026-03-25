package com.milestone.backend.service;

// import java.io.InputStream;
// import java.util.ArrayList;
// import java.util.List;

// import org.apache.poi.sl.usermodel.Sheet;
// import org.apache.poi.ss.usermodel.Row;
// import org.apache.poi.ss.usermodel.Workbook;
// import org.apache.poi.ss.usermodel.WorkbookFactory;
// import org.springframework.stereotype.Service;

// import com.milestone.backend.entity.ExternalLawyers;

// @Service
// public class NGOsExcelService {

//     public List<ExternalLawyers> parseLawyerExcelData(InputStream is){
//         List<ExternalLawyers> lawyers = new ArrayList<>();

//         try(Workbook workbook = WorkbookFactory.create(is)){

//             Sheet sheet = workbook.getSheetAt(0);

//             for (int i = 1; i <= sheet.getLastRowNum(); i++) { 
//                 Row row = sheet.getRow(i);

//                 if (row == null) continue;

//                 ExternalLawyers user = new ExternalLawyers();

//                 user.setName(getCellValue(row.getCell(0)));
//                 user.setEmail(getCellValue(row.getCell(1)));
//                 user.setAge((int) row.getCell(2).getNumericCellValue());

//                 users.add(user);
//             }

//         }
//         catch(Exception e){

//         }



//         return lawyers;
//     }
    
// }
