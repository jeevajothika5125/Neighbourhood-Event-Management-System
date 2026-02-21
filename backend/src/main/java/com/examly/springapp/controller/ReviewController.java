package com.examly.springapp.controller;

import com.examly.springapp.model.Review;
import com.examly.springapp.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @PostMapping("/submit")
    public ResponseEntity<String> submitReview(@RequestBody Review review) {
        reviewRepository.save(review);
        return ResponseEntity.ok("Review submitted successfully");
    }
}