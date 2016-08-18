
export const myNamespace = process.env.POD_NAMESPACE;
export const myName = process.env.POD_NAME;
export const myIp = process.env.POD_IP;

export const podLabels = process.env.GLUSTER_SIDECAR_POD_LABELS || 'name=gluster';
