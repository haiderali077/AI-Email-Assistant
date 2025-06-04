package com.email.writer.app;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailGeneratorService {

    @Value("${gemini.api.url}") // inject from properties
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String emailApiKey;

    public String generateEmailReply(EmailRequest emailRequest) {
        //Build the promptt
        String prompt = buildPrompt(emailRequest);
        //Craft a request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt),
                        })
                }
        );
        // Do request and get response

        //Return response
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email Reply for the following email content. Please don't generate a subject line unlesss you are specifically told to do so");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
