'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const myNamespace = exports.myNamespace = process.env.POD_NAMESPACE;
const myName = exports.myName = process.env.POD_NAME;
const myIp = exports.myIp = process.env.POD_IP;

const masterHost = exports.masterHost = process.env.MASTER_HOST || process.env.KUBERNETES_SERVICE_HOST;

const podLabels = exports.podLabels = process.env.GLUSTER_SIDECAR_POD_LABELS || 'name=gluster';

const volumeName = exports.volumeName = process.env.GLUSTER_VOLUME_NAME || 'shared0';
const brickPath = exports.brickPath = process.env.GLUSTER_BRICK_PATH || '/mnt/brick1/data';