export const myNamespace = process.env.POD_NAMESPACE;
export const myName = process.env.POD_NAME;
export const myIp = process.env.POD_IP;

export const masterHost = process.env.MASTER_HOST || process.env.KUBERNETES_SERVICE_HOST;

export const podLabels = process.env.GLUSTER_SIDECAR_POD_LABELS || 'name=gluster';

export const volumeName = process.env.GLUSTER_VOLUME_NAME || 'shared0';
export const brickPath = process.env.GLUSTER_BRICK_PATH || '/mnt/brick1/data';
