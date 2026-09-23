import { k8sCoreV1Api } from "./config";

export async function createPod(sandboxId){
    const podManifest ={
        metadata: {
            name:`sandbox-pod-${sandboxId}`,
            labels:{
                app:"sandbox",
                sandboxId : sandboxId
            },
            spec:{
                containers:{
                    image:"template",
                    imagePullPolicy:'IfNotPresent',
                    name: 'sandbox-container',
                    ports:[{
                        containerPort:5173
                    }],
                    resources:{
                        limits:{
                            cpu: '500m',
                            memory: '1Gi'
                        },
                        requests:{
                            cpu: '250m',
                            memory: '500Gi'
                        }
                    }
                }
            }
        }
    }

    const response = await k8sCoreV1Api.createNamespace({
        namespace: 'default',
        body:podManifest
    })
    return response
}