package com.skeduler.skeduler.jsonb;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.json.Json;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.bind.Jsonb;
import javax.json.bind.JsonbBuilder;
import javax.json.bind.serializer.DeserializationContext;
import javax.json.bind.serializer.JsonbDeserializer;
import javax.json.stream.JsonParser;

import com.skeduler.skeduler.models.Agenda;
import com.skeduler.skeduler.models.Employee;
import com.skeduler.skeduler.models.Job;
import com.skeduler.skeduler.models.WorkingDay;

public class EmployeeDeserializer implements JsonbDeserializer<Employee> {

	@Override
	public Employee deserialize(JsonParser parser, DeserializationContext ctx, Type rtType) {
        JsonObject object = parser.getObject();
        List<Job> jobs = Job.findAll().list();
        List<WorkingDay> workingDays = WorkingDay.findAll().list();

        Employee e = new Employee();
        // Agenda agenda = new Agenda();
        // JsonObject agendaObject = object.get("agenda").asJsonObject();
        // agenda.setEmployee(e);
        // agenda.setWorkingDays(agendaObject.getJsonArray("workingDays").getValuesAs(JsonNumber::longValue).stream().map(wd -> workingDays.stream().filter(w -> w.id == wd).findAny().orElse(null)).filter(Objects::nonNull).collect(Collectors.toSet()));
        // // TODO: Events

        // e.setName(object.getString("name"));
        // e.setContractHours(object.getInt("contractHours"));
        // e.setAgenda(agenda);
        // e.setJobs(object.getJsonArray("jobs").getValuesAs(JsonNumber::longValue).stream().map(j -> jobs.stream().filter(job -> job.id == j).findAny().orElse(null)).filter(Objects::nonNull).collect(Collectors.toSet()));
        return e;
	}

}
