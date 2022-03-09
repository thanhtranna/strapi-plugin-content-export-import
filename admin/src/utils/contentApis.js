import { request } from "strapi-helper-plugin";
import { filter } from "lodash";
import pluralize from "pluralize";
import { MODEL_KIND } from "../constants/model-kind";

export const getModels = () => {
  return request("/content-type-builder/content-types", {
    method: "GET",
  })
    .then((response) => {
      return filter(response.data, (model) => !model.plugin);
    })
    .catch(() => {
      return [];
    });
};

export const getNationalDestinations = () => {
  return request(
    "/content-manager/collection-types/application::national-destination.national-destination?page=1&pageSize=100&_sort=name:ASC",
    {
      method: "GET",
    }
  )
    .then((response) => {
      return filter(response.data.results, true).map((obj) => ({
        id: obj.id,
        name: obj.name,
      }));
    })
    .catch(() => {
      return [];
    });
};

export const fetchEntries = (apiId, kind) => {
  const url =
    kind === MODEL_KIND.collection ? `/${pluralize(apiId)}` : `/${apiId}`;
  return request(url, { method: "GET" });
};
