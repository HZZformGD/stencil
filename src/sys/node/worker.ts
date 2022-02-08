import 'stencil-hotfix/compiler';
import * as nodeApi from '@sys-api-node';
import { initNodeWorkerThread } from './node-worker-thread';

const coreCompiler = (global as any).stencil as typeof import('stencil-hotfix/compiler');
const nodeSys = nodeApi.createNodeSys({ process: process });
const msgHandler = coreCompiler.createWorkerMessageHandler(nodeSys);

initNodeWorkerThread(process, msgHandler);
