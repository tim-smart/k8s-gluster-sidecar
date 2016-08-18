'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const myNamespace = exports.myNamespace = process.env.POD_NAMESPACE;
const myName = exports.myName = process.env.POD_NAME;
const myIp = exports.myIp = process.env.POD_IP;

const podLabels = exports.podLabels = process.env.GLUSTER_SIDECAR_POD_LABELS || 'name=gluster';