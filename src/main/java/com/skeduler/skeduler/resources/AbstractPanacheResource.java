package com.skeduler.skeduler.resources;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;

import com.skeduler.skeduler.models.AbstractPanacheEntity;
import com.skeduler.skeduler.services.CRUDService;

import org.jboss.logging.Logger;
import org.jboss.logging.Logger.Level;

import java.util.List;

public abstract class AbstractPanacheResource<T extends AbstractPanacheEntity<T>, S extends CRUDService <T>> {
    private static final Logger LOGGER = Logger.getLogger(AbstractPanacheResource.class);

    @Inject
    S service;

    @GET
    public Response getAll() {
        List<T> entities = service.findAll();
        return Response.ok(entities).build();
    }

    @GET
    @Path("/{id}")
    public Response getEntity(
        @PathParam("id") Long id) {
        T entity = service.findById(id);
        if (entity != null) {
            return Response.ok(entity).build();
        } else {
            return Response.noContent().build();
        }
    }

    @POST
    public Response create(
        @Valid T entity, @Context UriInfo uriInfo,
        @Context io.vertx.core.http.HttpServerRequest req) {
            entity = service.persist(entity);
        UriBuilder builder = uriInfo.getAbsolutePathBuilder().path(Long.toString(entity.id));
        return Response.created(builder.build()).build();
    }

    @PUT
    public Response update(
        @Valid T entity) {
        entity = service.update(entity);
        return Response.ok(entity).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteHero(
        @PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }

}
