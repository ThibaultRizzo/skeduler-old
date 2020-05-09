package com.skeduler.skeduler.resources;

import org.jboss.logging.Logger;
import org.jboss.resteasy.annotations.SseElementType;

import io.smallrye.mutiny.Multi;
import io.vertx.mutiny.core.Vertx;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;

import com.skeduler.skeduler.models.Planning;
import com.skeduler.skeduler.models.WorkingDay;
import com.skeduler.skeduler.models.dto.PlanningSolution;
import com.skeduler.skeduler.services.PlanningService;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import java.util.Date;

import javax.inject.Inject;
import javax.validation.Valid;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;

@Path("/api/plannings")
@Produces(APPLICATION_JSON)
public class PlanningResource extends AbstractPanacheResource<Planning, PlanningService> {
    private static final Logger LOGGER = Logger.getLogger(PlanningResource.class);

    @Inject
    Vertx vertx;

    @GET
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @SseElementType(MediaType.APPLICATION_JSON)
    @Path("/generate")
    public Multi<PlanningSolution> generate() {
        return Multi.createFrom().item(service::generatePlanning);
    }
    // public Multi<String> generate() {
    //     return vertx.periodicStream(2000).toMulti()
    //     .map(l -> String.format("Hello %s! (%s)%n", "YOLO", new Date()));
    // }
}
