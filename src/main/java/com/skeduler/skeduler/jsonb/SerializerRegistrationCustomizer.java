package com.skeduler.skeduler.jsonb;

import javax.inject.Singleton;
import javax.json.bind.JsonbConfig;

import io.quarkus.jsonb.JsonbConfigCustomizer;

@Singleton
public class SerializerRegistrationCustomizer implements JsonbConfigCustomizer {
    public void customize(JsonbConfig config) {
        // config.withDeserializers(new EmployeeDeserializer());
    }
}
