package com.examly.springapp;

import java.io.File;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = SpringBootEmpApplication.class)
@AutoConfigureMockMvc
public class EventManagementTests {

    @Autowired
    private MockMvc mockMvc;

    // === API TESTS ===

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Add_Event() throws Exception {
        String json = """
        {
          "eventName": "Tech Conference",
          "description": "Annual tech conference",
          "eventDate": "2025-09-15",
          "location": "New York",
          "contactNumber": "9876543210",
          "organizerName": "Alice"
        }
        """;

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Get_All_Events() throws Exception {
        mockMvc.perform(get("/api/events")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Update_Event() throws Exception {
        String updateJson = """
        {
          "eventName": "Tech Conference Updated",
          "description": "Updated description",
          "eventDate": "2025-09-20",
          "location": "San Francisco",
          "contactNumber": "9876543210",
          "organizerName": "Alice"
        }
        """;

        mockMvc.perform(put("/api/events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Delete_Event() throws Exception {
        mockMvc.perform(delete("/api/events/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    // === DIRECTORY CHECKS ===

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Controller_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/controller");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Model_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/model");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Repository_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/repository");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Service_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/service");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    // === FILE CHECKS ===

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_EventModel_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/model/Event.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_EventController_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/controller/OrganizerController.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_EventRepository_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/repository/EventRepository.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_EventService_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/service/EventService.java");
        assertTrue(file.exists());
    }

    // === CLASS CHECKS ===

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_EventModel_Class_Exists() {
        checkClassExists("com.examly.springapp.model.Event");
    }

    // === FIELD CHECKS ===

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_Event_Has_Title_Field() {
        checkFieldExists("com.examly.springapp.model.Event", "eventName");
    }

    // === UTILITY METHODS ===

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + className);
        }
    }
}
