/// <reference path="../References.d.ts"/>
import * as React from 'react';
import * as Icons from '@blueprintjs/icons';
import * as NodeTypes from '../types/NodeTypes';
import * as ServiceTypes from '../types/ServiceTypes';
import * as AuthorityTypes from '../types/AuthorityTypes';
import * as CertificateTypes from '../types/CertificateTypes';
import * as NodeActions from '../actions/NodeActions';
import * as MiscUtils from '../utils/MiscUtils';
import CertificatesStore from '../stores/CertificatesStore';
import AuthoritiesStore from '../stores/AuthoritiesStore';
import ServicesStore from '../stores/ServicesStore';
import PageInput from './PageInput';
import PageSwitch from './PageSwitch';
import PageInputSwitch from './PageInputSwitch';
import PageSelectButton from './PageSelectButton';
import * as PageSelector from './PageSelector';
import PageInfo from './PageInfo';
import PageSave from './PageSave';
import ConfirmButton from './ConfirmButton';
import Help from './Help';

interface Props {
	node: NodeTypes.NodeRo;
	services: ServiceTypes.ServicesRo;
	authorities: AuthorityTypes.AuthoritiesRo;
	certificates: CertificateTypes.CertificatesRo;
	selected: boolean;
	onSelect: (shift: boolean) => void;
	onClose: () => void;
}

interface State {
	disabled: boolean;
	changed: boolean;
	message: string;
	node: NodeTypes.Node;
	addService: string;
	addCert: string;
	addAuthority: string;
	forwardedChecked: boolean;
	forwardedProtoChecked: boolean;
}

const css = {
	card: {
		position: 'relative',
		padding: '48px 10px 0 10px',
		width: '100%',
	} as React.CSSProperties,
	remove: {
		position: 'absolute',
		top: '5px',
		right: '5px',
	} as React.CSSProperties,
	item: {
		margin: '9px 5px 0 5px',
		height: '20px',
	} as React.CSSProperties,
	itemsLabel: {
		display: 'block',
	} as React.CSSProperties,
	itemsAdd: {
		margin: '8px 0 15px 0',
	} as React.CSSProperties,
	group: {
		flex: 1,
		minWidth: '250px',
	} as React.CSSProperties,
	save: {
		paddingBottom: '10px',
	} as React.CSSProperties,
	label: {
		width: '100%',
		maxWidth: '280px',
	} as React.CSSProperties,
	inputGroup: {
		width: '100%',
	} as React.CSSProperties,
	protocol: {
		minWidth: '90px',
		flex: '0 1 auto',
	} as React.CSSProperties,
	port: {
		minWidth: '120px',
		flex: '1',
	} as React.CSSProperties,
	button: {
		height: '30px',
	} as React.CSSProperties,
	buttons: {
		cursor: 'pointer',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		padding: '4px',
		height: '39px',
	} as React.CSSProperties,
	select: {
		margin: '7px 0px 0px 6px',
		paddingTop: '3px',
	} as React.CSSProperties,
};

export default class NodeDetailed extends React.Component<Props, State> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			disabled: false,
			changed: false,
			message: '',
			node: null,
			addService: null,
			addAuthority: null,
			addCert: null,
			forwardedChecked: false,
			forwardedProtoChecked: false,
		};
	}

	set(name: string, val: any): void {
		let node: any;

		if (this.state.changed) {
			node = {
				...this.state.node,
			};
		} else {
			node = {
				...this.props.node,
			};
		}

		node[name] = val;

		this.setState({
			...this.state,
			changed: true,
			node: node,
		});
	}

	toggleType(typ: string): void {
		let node: NodeTypes.Node = this.state.node || this.props.node;

		let vals = (node.type || '').split('_');

		let i = vals.indexOf(typ);
		if (i === -1) {
			vals.push(typ);
		} else {
			vals.splice(i, 1);
		}

		vals = vals.filter((val): boolean => {
			return !!val;
		});

		vals.sort();

		let val = vals.join('_');
		if (val === '') {
			val = 'management';
		}

		this.set('type', val);
	}

	onSave = (): void => {
		this.setState({
			...this.state,
			disabled: true,
		});
		NodeActions.commit(this.state.node).then((): void => {
			this.setState({
				...this.state,
				message: 'Your changes have been saved',
				changed: false,
				disabled: false,
			});

			setTimeout((): void => {
				if (!this.state.changed) {
					this.setState({
						...this.state,
						node: null,
						changed: false,
					});
				}
			}, 1000);

			setTimeout((): void => {
				if (!this.state.changed) {
					this.setState({
						...this.state,
						message: '',
					});
				}
			}, 3000);
		}).catch((): void => {
			this.setState({
				...this.state,
				message: '',
				disabled: false,
			});
		});
	}

	onDelete = (): void => {
		this.setState({
			...this.state,
			disabled: true,
		});
		NodeActions.remove(this.props.node.id).then((): void => {
			this.setState({
				...this.state,
				disabled: false,
			});
		}).catch((): void => {
			this.setState({
				...this.state,
				disabled: false,
			});
		});
	}

	onAddService = (serviceId: string): void => {
		let node: NodeTypes.Node;

		if (this.state.changed) {
			node = {
				...this.state.node,
			};
		} else {
			node = {
				...this.props.node,
			};
		}

		let services = [
			...(node.services || []),
		];

		if (services.indexOf(serviceId) === -1) {
			services.push(serviceId);
		}

		services.sort();

		node.services = services;

		this.setState({
			...this.state,
			changed: true,
			node: node,
		});
	}

	onRemoveService = (serviceId: string): void => {
		let node: NodeTypes.Node;

		if (this.state.changed) {
			node = {
				...this.state.node,
			};
		} else {
			node = {
				...this.props.node,
			};
		}

		let services = [
			...(node.services || []),
		];

		let i = services.indexOf(serviceId);
		if (i === -1) {
			return;
		}

		services.splice(i, 1);

		node.services = services;

		this.setState({
			...this.state,
			changed: true,
			node: node,
		});
	}

	onAddAuthority = (): void => {
		let node: NodeTypes.Node;

		if (!this.state.addAuthority && !this.props.authorities.length) {
			return;
		}

		let authorityId = this.state.addAuthority;

		if (!authorityId) {
			for (let authority of this.props.authorities) {
				if (!authority.proxy_hosting) {
					continue;
				}
				authorityId = authority.id;
				break;
			}
		}

		if (this.state.changed) {
			node = {
				...this.state.node,
			};
		} else {
			node = {
				...this.props.node,
			};
		}

		let authorities = [
			...(node.authorities || []),
		];

		if (authorities.indexOf(authorityId) === -1) {
			authorities.push(authorityId);
		}

		authorities.sort();

		node.authorities = authorities;

		this.setState({
			...this.state,
			changed: true,
			node: node,
		});
	}

	onRemoveAuthority = (authority: string): void => {
		let node: NodeTypes.Node;

		if (this.state.changed) {
			node = {
				...this.state.node,
			};
		} else {
			node = {
				...this.props.node,
			};
		}

		let authorities = [
			...(node.authorities || []),
		];

		let i = authorities.indexOf(authority);
		if (i === -1) {
			return;
		}

		authorities.splice(i, 1);

		node.authorities = authorities;

		this.setState({
			...this.state,
			changed: true,
			node: node,
		});
	}

	onAddCert = (): void => {
		let node: NodeTypes.Node;

		if (!this.state.addCert && !this.props.certificates.length) {
			return;
		}

		let certId = this.state.addCert || this.props.certificates[0].id;

		if (this.state.changed) {
			node = {
				...this.state.node,
			};
		} else {
			node = {
				...this.props.node,
			};
		}

		let certificates = [
			...(node.certificates || []),
		];

		if (certificates.indexOf(certId) === -1) {
			certificates.push(certId);
		}

		certificates.sort();

		node.certificates = certificates;

		this.setState({
			...this.state,
			changed: true,
			node: node,
		});
	}

	onRemoveCert = (certId: string): void => {
		let node: NodeTypes.Node;

		if (this.state.changed) {
			node = {
				...this.state.node,
			};
		} else {
			node = {
				...this.props.node,
			};
		}

		let certificates = [
			...(node.certificates || []),
		];

		let i = certificates.indexOf(certId);
		if (i === -1) {
			return;
		}

		certificates.splice(i, 1);

		node.certificates = certificates;

		this.setState({
			...this.state,
			changed: true,
			node: node,
		});
	}

	render(): JSX.Element {
		let node: NodeTypes.Node = this.state.node || this.props.node;
		let active = node.requests_min !== 0 || node.memory !== 0 ||
				node.load1 !== 0 || node.load5 !== 0 || node.load15 !== 0;

		let servicesSelected: PageSelector.Item[] = [];
		for (let serviceId of (node.services || [])) {
			let service = ServicesStore.serviceName(serviceId);
			if (!service) {
				continue;
			}

			servicesSelected.push({
				id: service.id,
				name: service.name,
			});
		}

		let servicesOptions: PageSelector.Item[] = [];
		if (this.props.services.length) {
			for (let service of this.props.services) {
				servicesOptions.push({
					id: service.id,
					name: service.name,
				});
			}
		}

		let authorities: JSX.Element[] = [];
		for (let authorityId of (node.authorities || [])) {
			let authority = AuthoritiesStore.authority(authorityId);
			if (!authority || !authority.proxy_hosting) {
				continue;
			}

			authorities.push(
				<div
					className="bp5-tag bp5-tag-removable bp5-intent-primary"
					style={css.item}
					key={authority.id}
				>
					{authority.name}
					<button
						className="bp5-tag-remove"
						onMouseUp={(): void => {
							this.onRemoveAuthority(authority.id);
						}}
					/>
				</div>,
			);
		}

		let authoritiesSelect: JSX.Element[] = [];
		if (this.props.authorities.length) {
			for (let authority of this.props.authorities) {
				if (!authority.proxy_hosting) {
					continue;
				}

				authoritiesSelect.push(
					<option
						key={authority.id}
						value={authority.id}
					>{authority.name}</option>,
				);
			}
		}
		if (!authoritiesSelect.length) {
			authoritiesSelect.push(<option key="null" value="">None</option>);
		}

		let certificates: JSX.Element[] = [];
		for (let certId of (node.certificates || [])) {
			let cert = CertificatesStore.certificate(certId);
			if (!cert) {
				continue;
			}

			certificates.push(
				<div
					className="bp5-tag bp5-tag-removable bp5-intent-primary"
					style={css.item}
					key={cert.id}
				>
					{cert.name}
					<button
						className="bp5-tag-remove"
						onMouseUp={(): void => {
							this.onRemoveCert(cert.id);
						}}
					/>
				</div>,
			);
		}

		let hasCertificates = false;
		let certificatesSelect: JSX.Element[] = [];
		if (this.props.certificates.length) {
			for (let certificate of this.props.certificates) {
				hasCertificates = true;

				certificatesSelect.push(
					<option key={certificate.id} value={certificate.id}>
						{certificate.name}
					</option>,
				);
			}
		}

		if (!hasCertificates) {
			certificatesSelect = [
				<option key="null" value="">
					No Certificates
				</option>,
			];
		}

		return <td
			className="bp5-cell"
			colSpan={4}
			style={css.card}
		>
			<div className="layout horizontal wrap">
				<div style={css.group}>
					<div
						className="layout horizontal tab-close bp5-card-header"
						style={css.buttons}
						onClick={(evt): void => {
							let target = evt.target as HTMLElement;

							if (target.className.indexOf('tab-close') !== -1) {
								this.props.onClose();
							}
						}}
					>
						<div>
							<label
								className="bp5-control bp5-checkbox"
								style={css.select}
							>
								<input
									type="checkbox"
									checked={this.props.selected}
									onChange={(evt): void => {
									}}
									onClick={(evt): void => {
										this.props.onSelect(evt.shiftKey);
									}}
								/>
								<span className="bp5-control-indicator"/>
							</label>
						</div>
						<div className="flex tab-close"/>
						<ConfirmButton
							className="bp5-minimal bp5-intent-danger bp5-icon-trash"
							style={css.button}
							safe={true}
							progressClassName="bp5-intent-danger"
							dialogClassName="bp5-intent-danger bp5-icon-delete"
							dialogLabel="Delete Node"
							confirmMsg="Permanently delete this node"
							confirmInput={true}
							items={[node.name]}
							disabled={active || this.state.disabled}
							onConfirm={this.onDelete}
						/>
					</div>
					<PageInput
						label="Name"
						help="Name of node"
						type="text"
						placeholder="Enter name"
						value={node.name}
						disabled={this.state.disabled}
						onChange={(val): void => {
							this.set('name', val);
						}}
					/>
					<PageSwitch
						disabled={this.state.disabled}
						label="Management"
						help="Provides access to the admin console."
						checked={node.type.indexOf('management') !== -1}
						onToggle={(): void => {
							this.toggleType('management');
						}}
					/>
					<PageSwitch
						disabled={this.state.disabled}
						label="User"
						help="Provides access to the user console for SSH certificates."
						checked={node.type.indexOf('user') !== -1}
						onToggle={(): void => {
							this.toggleType('user');
						}}
					/>
					<PageSwitch
						disabled={this.state.disabled}
						label="Proxy"
						help="Provides access to the services added to the node."
						checked={node.type.indexOf('proxy') !== -1}
						onToggle={(): void => {
							this.toggleType('proxy');
						}}
					/>
					<PageSwitch
						disabled={this.state.disabled}
						label="Bastion"
						help="Host bastion servers on this node."
						checked={node.type.indexOf('bastion') !== -1}
						onToggle={(): void => {
							this.toggleType('bastion');
						}}
					/>
					<PageInput
						hidden={node.type.indexOf('_') === -1 ||
							node.type.indexOf('management') === -1}
						disabled={this.state.disabled}
						label="Management Domain"
						help="Domain that will be used to access the management interface."
						type="text"
						placeholder="Enter management domain"
						value={node.management_domain}
						onChange={(val): void => {
							this.set('management_domain', val);
						}}
					/>
					<PageInput
						hidden={node.type.indexOf('_') === -1 ||
							node.type.indexOf('user') === -1}
						label="User Domain"
						help="Domain that will be used to access the user interface. When using U2F domain must be the same on all nodes with user active. Changing this will invalidate any existing U2F devices."
						type="text"
						placeholder="Enter user domain"
						value={node.user_domain}
						disabled={this.state.disabled}
						onChange={(val): void => {
							this.set('user_domain', val);
						}}
					/>
					<PageInput
						hidden={node.type.indexOf('_') === -1 ||
							node.type.indexOf('user') === -1}
						label="Endpoint Domain"
						help="Domain that endpoints will use for connectivity."
						type="text"
						placeholder="Enter endpoint domain"
						value={node.endpoint_domain}
						disabled={this.state.disabled}
						onChange={(val): void => {
							this.set('endpoint_domain', val);
						}}
					/>
					<PageInput
						disabled={this.state.disabled}
						hidden={node.type.indexOf('admin') === -1 &&
							node.type.indexOf('user') === -1}
						label="WebAuthn Domain"
						help="Domain that will be used for WebAuthn relying party identifier. This domain should be the highest level domain for the relevant resources. All other Pritunl Cloud domains handling WebAuthn authentication must be a sub-domain of this domain. Changing this domain will invalidate all existing WebAuthn devices."
						type="text"
						placeholder="Enter WebAuthn domain"
						value={node.webauthn_domain}
						onChange={(val): void => {
							this.set('webauthn_domain', val);
						}}
					/>
					<label className="bp5-label" style={css.label}>
						Protocol and Port
						<div className="bp5-control-group" style={css.inputGroup}>
							<div className="bp5-select" style={css.protocol}>
								<select
									value={node.protocol || 'https'}
									onChange={(evt): void => {
										this.set('protocol', evt.target.value);
									}}
								>
									<option value="http">HTTP</option>
									<option value="https">HTTPS</option>
								</select>
							</div>
							<input
								className="bp5-input"
								style={css.port}
								type="text"
								autoCapitalize="off"
								spellCheck={false}
								placeholder="Port"
								value={node.port || 443}
								onChange={(evt): void => {
									this.set('port', parseInt(evt.target.value, 10));
								}}
							/>
						</div>
					</label>
					<PageSwitch
						disabled={this.state.disabled}
						label="Web redirect server"
						help="Enable redirect server for HTTP requests to HTTPS. Required for Lets Encrypt certificates."
						checked={!node.no_redirect_server}
						onToggle={(): void => {
							this.set('no_redirect_server', !node.no_redirect_server);
						}}
					/>
					<PageSelector.PageSelector
						hidden={node.type.indexOf('proxy') === -1}
						disabled={this.state.disabled || !this.props.services.length}
						title="Services"
						help="Services that can be accessed from this node. The nodes certificate must be valid for all the service domains. The node also needs to be able to access all the interal servers of the services."
						addLabel="Add Service"
						menuLabel="Manage Services"
						icon={<Icons.Cloud/>}
						selected={servicesSelected}
						options={servicesOptions}
						onAdd={this.onAddService}
						onRemove={this.onRemoveService}
					/>
					<label
						className="bp5-label"
						style={css.label}
						hidden={node.type.indexOf('bastion') === -1}
					>
						Authority Bastions
						<Help
							title="Authority Bastions"
							content="Authorities that will be served with a bastion server."
						/>
						<div>
							{authorities}
						</div>
					</label>
					<PageSelectButton
						label="Add Authority"
						hidden={node.type.indexOf('bastion') === -1}
						value={this.state.addAuthority}
						disabled={this.state.disabled || !this.props.authorities.length}
						buttonClass="bp5-intent-success"
						onChange={(val: string): void => {
							this.setState({
								...this.state,
								addAuthority: val,
							});
						}}
						onSubmit={this.onAddAuthority}
					>
						{authoritiesSelect}
					</PageSelectButton>
				</div>
				<div style={css.group}>
					<PageInfo
						fields={[
							{
								label: 'ID',
								value: node.id || 'None',
							},
							{
								label: 'Version',
								value: node.software_version || 'Unknown',
							},
							{
								valueClass: active ? '' : 'bp5-text-intent-danger',
								label: 'Timestamp',
								value: MiscUtils.formatDate(node.timestamp) || 'Inactive',
							},
							{
								label: 'Requests',
								value: node.requests_min + '/min',
							},
							{
								label: 'Hostname',
								value: node.hostname || 'Unknown',
							},
						]}
						bars={[
							{
								progressClass: 'bp5-no-stripes bp5-intent-primary',
								label: 'Memory',
								value: node.memory,
							},
							{
								progressClass: 'bp5-no-stripes bp5-intent-success',
								label: 'Load1',
								value: node.load1,
							},
							{
								progressClass: 'bp5-no-stripes bp5-intent-warning',
								label: 'Load5',
								value: node.load5,
							},
							{
								progressClass: 'bp5-no-stripes bp5-intent-danger',
								label: 'Load15',
								value: node.load15,
							},
						]}
					/>
					<label
						className="bp5-label"
						style={css.label}
						hidden={node.protocol === 'http'}
					>
						Certificates
						<Help
							title="Certificates"
							content="The certificates to use for this nodes web server. The certificates must be valid for all the domains that this node provides access to. This includes the management domain and any service domains."
						/>
						<div>
							{certificates}
						</div>
					</label>
					<PageSelectButton
						hidden={node.protocol === 'http'}
						label="Add Certificate"
						value={this.state.addCert}
						disabled={this.state.disabled || !hasCertificates}
						buttonClass="bp5-intent-success"
						onChange={(val: string): void => {
							this.setState({
								...this.state,
								addCert: val,
							});
						}}
						onSubmit={this.onAddCert}
					>
						{certificatesSelect}
					</PageSelectButton>
					<PageInputSwitch
						label="Forwarded for header"
						help="Enable when using a load balancer. This header value will be used to get the users IP address. It is important to only enable this when a load balancer is used. If it is enabled without a load balancer users can spoof their IP address by providing a value for the header that will not be overwritten by a load balancer. Additionally the nodes firewall should be configured to only accept requests from the load balancer to prevent requests being sent directly to the node bypassing the load balancer."
						type="text"
						placeholder="Forwarded for header"
						value={node.forwarded_for_header}
						checked={this.state.forwardedChecked}
						defaultValue="X-Forwarded-For"
						onChange={(state: boolean, val: string): void => {
							let nde: NodeTypes.Node;

							if (this.state.changed) {
								nde = {
									...this.state.node,
								};
							} else {
								nde = {
									...this.props.node,
								};
							}

							nde.forwarded_for_header = val;

							this.setState({
								...this.state,
								changed: true,
								forwardedChecked: state,
								node: nde,
							});
						}}
					/>
					<PageInputSwitch
						label="Forwarded proto header"
						help="Enable when using a load balancer. This header value will be used to get the users protocol. This will redirect users to https when the forwarded protocol is http."
						type="text"
						placeholder="Forwarded proto header"
						value={node.forwarded_proto_header}
						checked={this.state.forwardedProtoChecked}
						defaultValue="X-Forwarded-Proto"
						onChange={(state: boolean, val: string): void => {
							let nde: NodeTypes.Node;

							if (this.state.changed) {
								nde = {
									...this.state.node,
								};
							} else {
								nde = {
									...this.props.node,
								};
							}

							nde.forwarded_proto_header = val;

							this.setState({
								...this.state,
								changed: true,
								forwardedProtoChecked: state,
								node: nde,
							});
						}}
					/>
				</div>
			</div>
			<PageSave
				style={css.save}
				hidden={!this.state.node}
				message={this.state.message}
				changed={this.state.changed}
				disabled={this.state.disabled}
				light={true}
				onCancel={(): void => {
					this.setState({
						...this.state,
						changed: false,
						forwardedChecked: false,
						forwardedProtoChecked: false,
						node: null,
					});
				}}
				onSave={this.onSave}
			/>
		</td>;
	}
}
