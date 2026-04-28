import {XMLParser} from 'fast-xml-parser';

/** Shared parser for RSS and sitemap XML (avoid allocating multiple parsers). */
export const rssXmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
});
