/// <reference path="../References.d.ts"/>
import * as SuperAgent from 'superagent';
import Dispatcher from '../dispatcher/Dispatcher';
import EventDispatcher from '../dispatcher/EventDispatcher';
import * as Alert from '../Alert';
import * as Csrf from '../Csrf';
import Loader from '../Loader';
import * as NodeTypes from '../types/NodeTypes';
import NodesStore from '../stores/NodesStore';
import * as MiscUtils from '../utils/MiscUtils';

let syncId: string;

export function sync(noLoading?: boolean): Promise<void> {
	let curSyncId = MiscUtils.uuid();
	syncId = curSyncId;

	let loader: Loader;
	if (!noLoading) {
		loader = new Loader().loading();
	}

	return new Promise<void>((resolve, reject): void => {
		SuperAgent
			.get('/node')
			.query({
				...NodesStore.filter,
				page: NodesStore.page,
				page_count: NodesStore.pageCount,
			})
			.set('Accept', 'application/json')
			.set('Csrf-Token', Csrf.token)
			.end((err: any, res: SuperAgent.Response): void => {
				if (loader) {
					loader.done();
				}

				if (res && res.status === 401) {
					window.location.href = '/login';
					resolve();
					return;
				}

				if (curSyncId !== syncId) {
					resolve();
					return;
				}

				if (err) {
					Alert.errorRes(res, 'Failed to load nodes');
					reject(err);
					return;
				}

				Dispatcher.dispatch({
					type: NodeTypes.SYNC,
					data: {
						nodes: res.body.nodes,
						count: res.body.count,
					},
				});

				resolve();
			});
	});
}

export function traverse(page: number): Promise<void> {
	Dispatcher.dispatch({
		type: NodeTypes.TRAVERSE,
		data: {
			page: page,
		},
	});
	return sync();
}

export function filter(filt: NodeTypes.Filter): Promise<void> {
	Dispatcher.dispatch({
		type: NodeTypes.FILTER,
		data: {
			filter: filt,
		},
	});
	return sync();
}

export function commit(node: NodeTypes.Node): Promise<void> {
	let loader = new Loader().loading();

	return new Promise<void>((resolve, reject): void => {
		SuperAgent
			.put('/node/' + node.id)
			.send(node)
			.set('Accept', 'application/json')
			.set('Csrf-Token', Csrf.token)
			.end((err: any, res: SuperAgent.Response): void => {
				loader.done();

				if (res && res.status === 401) {
					window.location.href = '/login';
					resolve();
					return;
				}

				if (err) {
					Alert.errorRes(res, 'Failed to save node');
					reject(err);
					return;
				}

				resolve();
			});
	});
}

export function create(node: NodeTypes.Node): Promise<void> {
	let loader = new Loader().loading();

	return new Promise<void>((resolve, reject): void => {
		SuperAgent
			.post('/node')
			.send(node)
			.set('Accept', 'application/json')
			.set('Csrf-Token', Csrf.token)
			.end((err: any, res: SuperAgent.Response): void => {
				loader.done();

				if (res && res.status === 401) {
					window.location.href = '/login';
					resolve();
					return;
				}

				if (err) {
					Alert.errorRes(res, 'Failed to create node');
					reject(err);
					return;
				}

				resolve();
			});
	});
}

export function remove(nodeId: string): Promise<void> {
	let loader = new Loader().loading();

	return new Promise<void>((resolve, reject): void => {
		SuperAgent
			.delete('/node/' + nodeId)
			.set('Accept', 'application/json')
			.set('Csrf-Token', Csrf.token)
			.end((err: any, res: SuperAgent.Response): void => {
				loader.done();

				if (res && res.status === 401) {
					window.location.href = '/login';
					resolve();
					return;
				}

				if (err) {
					Alert.errorRes(res, 'Failed to delete nodes');
					reject(err);
					return;
				}

				resolve();
			});
	});
}

EventDispatcher.register((action: NodeTypes.NodeDispatch) => {
	switch (action.type) {
		case NodeTypes.CHANGE:
			sync();
			break;
	}
});
