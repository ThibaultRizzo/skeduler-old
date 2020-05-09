package com.skeduler.skeduler.resources;

import org.jboss.logging.Logger;

import javax.ws.rs.*;

import com.skeduler.skeduler.models.Employee;
import com.skeduler.skeduler.services.EmployeeService;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("/api/employees")
@Produces(APPLICATION_JSON)
public class EmployeeResource extends AbstractPanacheResource<Employee, EmployeeService> {
    private static final Logger LOGGER = Logger.getLogger(EmployeeResource.class);

}
