/// <reference path="../References.d.ts"/>
import * as React from 'react';
import * as SettingsTypes from '../types/SettingsTypes';
import PageInput from './PageInput';
import PageInputButton from './PageInputButton';
import PageTextArea from './PageTextArea';
import PageSwitch from './PageSwitch';
import PageInfo from './PageInfo';
import PageSelect from './PageSelect';
import Help from './Help';

interface Props {
	provider: SettingsTypes.ProviderAny;
	onChange: (state: SettingsTypes.ProviderAny) => void;
	onRemove: () => void;
}

interface State {
	addRole: string;
}

const css = {
	label: {
		fontSize: '16px',
		margin: '0 0 7px 0',
	} as React.CSSProperties,
	card: {
		marginBottom: '5px',
	} as React.CSSProperties,
	role: {
		margin: '9px 5px 0 5px',
		height: '20px',
	} as React.CSSProperties,
};

export default class SettingsProvider extends React.Component<Props, State> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			addRole: '',
		};
	}

	clone(): SettingsTypes.ProviderAny {
		return {
			...this.props.provider,
		};
	}

	azure(): JSX.Element {
		let provider = this.props.provider;

		return <div>
			<PageSelect
				label="Region"
				help="Azure active directory region"
				value={provider.region}
				onChange={(val): void => {
					let state = this.clone();
					state.region = val;
					this.props.onChange(state);
				}}
			>
				<option value="global2">Global (OAuth v2)</option>
				<option value="us-gov2">US Goverment (OAuth v2)</option>
				<option value="china2">China (OAuth v2)</option>
				<option value="global">Global (OAuth v1)</option>
				<option value="us-gov">US Goverment (OAuth v1)</option>
				<option value="china">China (OAuth v1)</option>
			</PageSelect>
			<PageInput
				label="Directory ID"
				help="Azure active directory ID"
				type="text"
				placeholder="Azure directory ID"
				value={provider.tenant}
				onChange={(val: string): void => {
					let state = this.clone();
					state.tenant = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="Application ID"
				help="Azure application ID"
				type="text"
				placeholder="Azure application ID"
				value={provider.client_id}
				onChange={(val: string): void => {
					let state = this.clone();
					state.client_id = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="Application Secret"
				help="Azure application secret"
				type="text"
				placeholder="Azure application secret"
				value={provider.client_secret}
				onChange={(val: string): void => {
					let state = this.clone();
					state.client_secret = val;
					this.props.onChange(state);
				}}
			/>
		</div>;
	}

	authzero(): JSX.Element {
		let provider = this.props.provider;

		return <div>
			<PageInput
				label="Auth0 Sub-Domain"
				help="Subdomain of Auth0 application. Enter subdomain portion only such as 'pritunl' for pritunl.auth0.com"
				type="text"
				placeholder="Auth0 sub-domain"
				value={provider.domain}
				onChange={(val: string): void => {
					let state = this.clone();
					state.domain = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="Client ID"
				help="Auth0 application client ID"
				type="text"
				placeholder="Auth0 client ID"
				value={provider.client_id}
				onChange={(val: string): void => {
					let state = this.clone();
					state.client_id = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="Client Secret"
				help="Auth0 application client secret"
				type="text"
				placeholder="Auth0 client secret"
				value={provider.client_secret}
				onChange={(val: string): void => {
					let state = this.clone();
					state.client_secret = val;
					this.props.onChange(state);
				}}
			/>
		</div>;
	}

	google(): JSX.Element {
		let provider = this.props.provider;

		return <div>
			<PageInput
				label="Domain"
				help="Domain segment of email address to match"
				type="text"
				placeholder="Google domain to match"
				value={provider.domain}
				onChange={(val: string): void => {
					let state = this.clone();
					state.domain = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="Google Admin Email"
				help="Optional, the email address of an administrator user in the Google G Suite to delegate API access to. This user will be used to get the groups of Google users. Only needed when providing the Google JSON private key."
				type="text"
				placeholder="Google admin email"
				value={provider.google_email}
				onChange={(val: string): void => {
					let state = this.clone();
					state.google_email = val;
					this.props.onChange(state);
				}}
			/>
			<PageTextArea
				label="Google JSON Private Key"
				help="Optional, private key for service account in JSON format. This will copy the Google users groups to Pritunl Zero. Also requires Google admin email."
				placeholder="Google JSON private key"
				rows={6}
				value={provider.google_key}
				onChange={(val: string): void => {
					let state = this.clone();
					state.google_key = val;
					this.props.onChange(state);
				}}
			/>
		</div>;
	}

	onelogin(): JSX.Element {
		let provider = this.props.provider;

		return <div>
			<PageInput
				label="Issuer URL"
				help="Single sign-on URL found in OneLogin app settings"
				type="text"
				placeholder="OneLogin issuer URL"
				value={provider.issuer_url}
				onChange={(val: string): void => {
					let state = this.clone();
					state.issuer_url = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="SAML 2.0 Endpoint (HTTP)"
				help="SAML 2.0 endpoint found in OneLogin app settings"
				type="text"
				placeholder="OneLogin SAML endpoint"
				value={provider.saml_url}
				onChange={(val: string): void => {
					let state = this.clone();
					state.saml_url = val;
					this.props.onChange(state);
				}}
			/>
			<PageTextArea
				label="X.509 Certificate"
				help="X.509 certificate found in OneLogin app settings"
				placeholder="OneLogin X.509 certificate"
				rows={6}
				value={provider.saml_cert}
				onChange={(val: string): void => {
					let state = this.clone();
					state.saml_cert = val;
					this.props.onChange(state);
				}}
			/>
		</div>;
	}

	okta(): JSX.Element {
		let provider = this.props.provider;

		return <div>
			<PageInput
				label="Identity Provider Single Sign-On URL"
				help="Single sign-on URL found in Okta app settings"
				type="text"
				placeholder="Okta single sign-on URL"
				value={provider.saml_url}
				onChange={(val: string): void => {
					let state = this.clone();
					state.saml_url = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="Identity Provider Issuer URL"
				help="Issuer URL found in Okta app settings"
				type="text"
				placeholder="Okta issuer URL"
				value={provider.issuer_url}
				onChange={(val: string): void => {
					let state = this.clone();
					state.issuer_url = val;
					this.props.onChange(state);
				}}
			/>
			<PageTextArea
				label="X.509 Certificate"
				help="X.509 certificate found in Okta app settings"
				placeholder="Okta X.509 certificate"
				rows={6}
				value={provider.saml_cert}
				onChange={(val: string): void => {
					let state = this.clone();
					state.saml_cert = val;
					this.props.onChange(state);
				}}
			/>
		</div>;
	}

	jumpcloud(): JSX.Element {
		let provider = this.props.provider;

		return <div>
			<PageInput
				label="Identity Provider Single Sign-On URL"
				help="Single sign-on URL found in JumpCloud app settings"
				type="text"
				placeholder="JumpCloud single sign-on URL"
				value={provider.saml_url}
				onChange={(val: string): void => {
					let state = this.clone();
					state.saml_url = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="Identity Provider Issuer URL"
				help="Issuer URL found in JumpCloud app settings"
				type="text"
				placeholder="JumpCloud issuer URL"
				value={provider.issuer_url}
				onChange={(val: string): void => {
					let state = this.clone();
					state.issuer_url = val;
					this.props.onChange(state);
				}}
			/>
			<PageTextArea
				label="X.509 Certificate"
				help="X.509 certificate found in JumpCloud app settings"
				placeholder="JumpCloud X.509 certificate"
				rows={6}
				value={provider.saml_cert}
				onChange={(val: string): void => {
					let state = this.clone();
					state.saml_cert = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="JumpCloud App ID"
				help="Optional, ID of JumpCloud Pritunl app. This can be found in the URL of the app settings page. Required to verify user is attached to JumpCloud application"
				type="text"
				placeholder="JumpCloud app ID"
				value={provider.jumpcloud_app_id}
				onChange={(val: string): void => {
					let state = this.clone();
					state.jumpcloud_app_id = val;
					this.props.onChange(state);
				}}
			/>
			<PageInput
				label="JumpCloud API Key"
				help="JumpCloud API key for user account status verfication"
				type="text"
				placeholder="JumpCloud client secret"
				value={provider.jumpcloud_secret}
				onChange={(val: string): void => {
					let state = this.clone();
					state.jumpcloud_secret = val;
					this.props.onChange(state);
				}}
			/>
		</div>;
	}

	render(): JSX.Element {
		let provider = this.props.provider;
		let label = '';
		let options: JSX.Element;

		switch (provider.type) {
			case 'azure':
				label = 'Azure';
				options = this.azure();
				break;
			case 'authzero':
				label = 'Auth0';
				options = this.authzero();
				break;
			case 'google':
				label = 'Google';
				options = this.google();
				break;
			case 'onelogin':
				label = 'OneLogin';
				options = this.onelogin();
				break;
			case 'okta':
				label = 'Okta';
				options = this.okta();
				break;
			case 'jumpcloud':
				label = 'JumpCloud';
				options = this.jumpcloud();
				break;
		}

		let roles: JSX.Element[] = [];
		for (let role of provider.default_roles) {
			roles.push(
				<div
					className="bp5-tag bp5-tag-removable bp5-intent-primary"
					style={css.role}
					key={role}
				>
					{role}
					<button
						className="bp5-tag-remove"
						onMouseUp={(): void => {
							let rls = [
								...this.props.provider.default_roles,
							];

							let i = rls.indexOf(role);
							if (i === -1) {
								return;
							}

							rls.splice(i, 1);

							let state = this.clone();
							state.default_roles = rls;
							this.props.onChange(state);
						}}
					/>
				</div>,
			);
		}

		return <div className="bp5-card" style={css.card}>
			<h6 style={css.label}>{label}</h6>
			<PageInfo
				fields={[
					{
						label: 'ID',
						value: provider.id || 'None',
					},
				]}
			/>
			<PageInput
				label="Label"
				help="Provider label that will be shown to users on the login page"
				type="text"
				placeholder="Provider label"
				value={provider.label}
				onChange={(val: string): void => {
					let state = this.clone();
					state.label = val;
					this.props.onChange(state);
				}}
			/>
			<label className="bp5-label" hidden={!provider.auto_create}>
				Default Roles
				<Help
					title="Default Roles"
					content="When the user has authenticated for the first time these roles will be given to the user. These roles may also be used to update the users roles depending on the role management option."
				/>
				<div>
					{roles}
				</div>
			</label>
			<PageInputButton
				buttonClass="bp5-intent-success bp5-icon-add"
				label="Add"
				type="text"
				placeholder="Add default role"
				hidden={!provider.auto_create}
				value={this.state.addRole}
				onChange={(val: string): void => {
					this.setState({
						...this.state,
						addRole: val,
					});
				}}
				onSubmit={(): void => {
					let rls = [
						...this.props.provider.default_roles,
					];

					if (!this.state.addRole) {
						return;
					}

					if (rls.indexOf(this.state.addRole) === -1) {
						rls.push(this.state.addRole);
					}

					rls.sort();

					let state = this.clone();
					state.default_roles = rls;
					this.props.onChange(state);

					this.setState({
						...this.state,
						addRole: '',
					});
				}}
			/>
			<PageSwitch
				label="Create user on authentication"
				help="Create the user on first authentication. If this is disabled all users must be manually created before they are able to authenticate."
				checked={provider.auto_create}
				onToggle={(): void => {
					let state = this.clone();
					state.auto_create = !state.auto_create;

					if (!state.auto_create &&
							state.role_management === 'set_on_insert') {
						state.role_management = 'merge';
					}

					this.props.onChange(state);
				}}
			/>
			<PageSelect
				label="Role Management"
				help="When the user authenticates for the first time a user will be created and the users roles will be set to the roles configured above. This is referenced as set on insert. It may be desired to update the roles on subsequent authentications. For this the merge mode can be used which will take the users current roles and merge them with the roles configured above using all the roles from both sets. Overwrite mode will replace the users roles on every authentication with the roles configured above. It is important to consider that if a users roles are modified those modifications will be lost when the overwrite mode is used."
				value={provider.role_management}
				onChange={(val): void => {
					let state = this.clone();
					state.role_management = val;
					this.props.onChange(state);
				}}
			>
				<option
					value="set_on_insert"
					hidden={!provider.auto_create}
				>Set on insert</option>
				<option value="merge">Merge</option>
				<option value="overwrite">Overwrite</option>
			</PageSelect>
			{options}
			<button
				className="bp5-button bp5-intent-danger"
				onClick={(): void => {
					this.props.onRemove();
				}}
			>Remove</button>
		</div>;
	}
}
