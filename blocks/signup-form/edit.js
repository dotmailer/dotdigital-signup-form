import {
	useBlockProps,
	InspectorControls,
	URLInputButton,
} from '@wordpress/block-editor';
import { CheckboxControl, Panel, PanelBody, PanelRow, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';
/**
 * Editor styles.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Edit function.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object}   args
 * @param {Object}   args.attributes
 * @param {Function} args.setAttributes
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showtitle,
		showdesc,
		redirecturl,
	} = attributes;

	const blockProps = useBlockProps();
	const [ widgetContent, setWidgetContent ] = useState( '' );
	const [ widgetLoading, setWidgetLoading ] = useState( false );

	const onChangeShowTitle = ( val ) => {
		setAttributes( {
			showtitle: val,
		} );
		setWidgetLoading( true );
		fetchWidget().then( () => {
			setWidgetLoading( false );
		} );
	};

	const onChangeShowDescription = ( val ) => {
		setAttributes( {
			showdesc: val,
		} );
		setWidgetLoading( true );
		fetchWidget().then( () => {
			setWidgetLoading( false );
		} );
	};

	const onChangeRedirectUrl = ( post ) => {
		setAttributes( {
			redirecturl: post,
		} );
	};

	const blockStyle = {
		backgroundColor: '#f6f7f7',
		padding: '20px',
	};

	const fetchWidget = () => {
		const params = new URLSearchParams();
		params.append( 'showtitle', showtitle ? 1 : 0 );
		params.append( 'showdesc', showdesc ? 1 : 0 );
		params.append( 'redirection', redirecturl ?? '' );

		return fetch( `//${ window.location.host }?rest_route=/dotdigital/v1/signup-widget&${ params.toString() }` )
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				setWidgetContent( data );
			} );
	};

	fetchWidget();

	return (
		<>
			<InspectorControls>
				<Panel>
					<PanelBody title="Configuration" initialOpen={ true }>
						<PanelRow>
							<CheckboxControl label="Show title" checked={ showtitle } onChange={ onChangeShowTitle } />
						</PanelRow>
						<PanelRow>
							<CheckboxControl label="Show description" checked={ showdesc } onChange={ onChangeShowDescription } />
						</PanelRow>
						<PanelRow>
							<div className={ 'url-button-wrapper' }>
								<URLInputButton __nextHasNoMarginBottom label="Redirect Url" url={ redirecturl } onChange={ onChangeRedirectUrl } />
							</div>
						</PanelRow>
						<PanelRow>
							{ ( redirecturl )
								? <p><a target={ '_blank' } rel="noreferrer" href={ redirecturl } >{ redirecturl }</a></p>
								: <p className={ 'components-checkbox-control__label' }>Select redirect URL</p>
							}
						</PanelRow>
					</PanelBody>
				</Panel>
			</InspectorControls>
			<div
				{ ...blockProps }
				style={ blockStyle }>
				<div className={ 'dd-widget-block-overlay' } style={ { display: widgetLoading ? 'block' : 'none' } } />
				<Spinner
					style={ { display: widgetLoading ? 'block' : 'none' } }
					className={ 'dd-widget-block-loader' }
				/>

				{ widgetContent ? (
					<div dangerouslySetInnerHTML={ { __html: widgetContent } } />
				) : (
					''
				) }
			</div>
		</>
	);
}
