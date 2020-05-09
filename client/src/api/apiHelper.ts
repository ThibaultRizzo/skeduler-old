import { Search } from 'history';
import queryString from 'query-string';

import ApiError from './ApiError';

export interface RequestParams {
  [key: string]: any;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface BinaryResponse {
  blob: Blob;
  fileName?: string;
}

const responseFileName = (response: Response, defaultFileName?: string) => {
  const disjob = response.headers.get('Content-Disjob');
  if (disjob && disjob.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disjob);
    if (matches !== null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
  }
  return defaultFileName;
};

/**
 * Return the value of the CSRF token.
 */
const csrfToken = () => {
  const { cookie } = document;
  if (cookie.indexOf('XSRF-TOKEN') < 0) {
    return '';
  }

  /*
   * The regular expression was found here:
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
   */
  return cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, '$1');
};

/**
 * Return the HTTP headers to include to the HTTP request.
 */
const generateHeaders = (customHeaders: HeadersInit, withToken = true) => {
  const headers = new Headers(customHeaders);

  if (withToken) {
    headers.append('X-XSRF-TOKEN', csrfToken());
  }

  return headers;
};

export const parseQueryString = (search: Search): RequestParams => {
  return queryString.parse(search && search.substring(1)); // The search string starts with '?', which we want to ignore
};

/**
 * Transform the given object containing params into the matching query
 * string.
 */
export const toQueryString = (params: RequestParams) =>
  /* Generates string for query */
  Object.keys(params)
    .map(key => {
      const value = params[key];
      if (Array.isArray(value)) {
        return value.map(arrayValue => `${key}=${encodeURIComponent(arrayValue)}`).join('&');
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');

/**
 * Returns the path with query string that matches the given parameters.
 */
export const pathWithQueryString = (path: string = '', params: RequestParams = {}) => {
  const queryString = toQueryString(params);
  return queryString ? `${path}?${queryString}` : path;
};

const execute = (
  path: string,
  method: RequestMethod,
  params: RequestParams,
  body: BodyInit | null,
  headers: HeadersInit,
  binary: boolean = false,
) =>
  fetch(pathWithQueryString(path, params), {
    method,
    credentials: 'same-origin',
    body,
    headers: generateHeaders(headers),
  }).then(response => {
    if (response.status === 204) {
      return Promise.resolve();
    }
    const contentType = response.headers.get('Content-Type') || '';
    const bodyPromise = binary
      ? response
        .blob()
        .then((blob): BinaryResponse => ({ blob, fileName: responseFileName(response) }))
      : contentType.indexOf('application/json') === 0
        ? response.json()
        : response.text();
    return bodyPromise.then(responseBody => {
      if (response.ok) {
        return responseBody;
      }
      console.error('API error:', responseBody);
      throw new ApiError(response.status, responseBody);
    });
  });

const get = (path: string, params: RequestParams = {}, headers: HeadersInit = {}) =>
  execute(path, 'GET', params, null, headers);

const getBinary = (path: string, params: RequestParams = {}, headers: HeadersInit = {}) =>
  execute(path, 'GET', params, null, headers, true);

const del = (path: string, params: RequestParams = {}, headers: HeadersInit = {}) =>
  execute(path, 'DELETE', params, null, headers);

const post = (
  path: string,
  body: BodyInit | null,
  params: RequestParams = {},
  headers: HeadersInit = {},
) => execute(path, 'POST', params, body, headers);

const postJson = (path: string, body: any, params: RequestParams = {}, headers: HeadersInit = {}) =>
  post(path, JSON.stringify(body), params, {
    ...headers,
    'Content-Type': 'application/json',
  });

const multipartFormData = (
  jsonPartName: string,
  jsonBody: any,
  attachmentPartName: string,
  attachment?: File,
) => {
  const formData = new FormData();
  formData.append(jsonPartName, new Blob([JSON.stringify(jsonBody)], { type: 'application/json' }));
  if (attachment) {
    formData.append(attachmentPartName, attachment);
  }
  return formData;
};

const postMultipartJson = (
  path: string,
  jsonPartName: string,
  attachmentPartName: string,
  jsonBody: any,
  attachment?: File,
  params: RequestParams = {},
  headers: HeadersInit = {},
) =>
  post(
    path,
    multipartFormData(jsonPartName, jsonBody, attachmentPartName, attachment),
    params,
    headers,
  );

const put = (
  path: string,
  body: BodyInit | null,
  params: RequestParams = {},
  headers: HeadersInit = {},
) => execute(path, 'PUT', params, body, headers);

const putJson = (path: string, body: any, params: RequestParams = {}, headers: HeadersInit = {}) =>
  put(path, JSON.stringify(body), params, {
    ...headers,
    'Content-Type': 'application/json',
  });

const putMultipartJson = (
  path: string,
  jsonPartName: string,
  attachmentPartName: string,
  jsonBody: any,
  attachment?: File,
  params: RequestParams = {},
  headers: HeadersInit = {},
) =>
  put(
    path,
    multipartFormData(jsonPartName, jsonBody, attachmentPartName, attachment),
    params,
    headers,
  );

const patch = (
  path: string,
  body: BodyInit | null,
  params: RequestParams = {},
  headers: HeadersInit = {},
) => execute(path, 'PATCH', params, body, headers);

const patchJson = (
  path: string,
  body: any,
  params: RequestParams = {},
  headers: HeadersInit = {},
) =>
  patch(path, JSON.stringify(body), params, {
    ...headers,
    'Content-Type': 'application/json',
  });

export default {
  get,
  getBinary,
  del,
  delete: del,
  post,
  put,
  patch,
  postJson,
  postMultipartJson,
  putJson,
  patchJson,
  putMultipartJson,
};
