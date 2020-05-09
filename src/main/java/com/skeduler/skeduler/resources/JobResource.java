package com.skeduler.skeduler.resources;

import org.jboss.logging.Logger;

import javax.ws.rs.*;

import com.skeduler.skeduler.models.Job;
import com.skeduler.skeduler.services.JobService;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("/api/jobs")
@Produces(APPLICATION_JSON)
public class JobResource extends AbstractPanacheResource<Job, JobService> {
    private static final Logger LOGGER = Logger.getLogger(JobResource.class);

}
