package com.skeduler.skeduler.resources;

import org.jboss.logging.Logger;

import javax.ws.rs.*;

import com.skeduler.skeduler.models.WorkingDay;
import com.skeduler.skeduler.services.WorkingDayService;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("/api/working-days")
@Produces(APPLICATION_JSON)
public class WorkingDayResource extends AbstractPanacheResource<WorkingDay, WorkingDayService> {
    private static final Logger LOGGER = Logger.getLogger(WorkingDayResource.class);

}
