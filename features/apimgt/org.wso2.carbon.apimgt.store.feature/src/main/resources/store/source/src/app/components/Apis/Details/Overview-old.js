/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Col, Popconfirm, Row, Form, Select, Dropdown, Tag, Menu, Badge, message} from 'antd';

const FormItem = Form.Item;
import Loading from '../../Base/Loading/Loading'
import ResourceNotFound from "../../Base/Errors/ResourceNotFound";
import Api from '../../../data/api';
import BasicInfo from './BasicInfo';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Card, {CardActions, CardContent, CardMedia} from 'material-ui/Card';
import Table, {TableBody, TableCell, TableRow} from 'material-ui/Table';
import {Delete, Edit, CreateNewFolder, Description}from 'material-ui-icons';
import Tabs, {Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import AddIcon from 'material-ui-icons/';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            api: null,
            applications: null,
            policies: null,
            dropDownApplications: null,
            dropDownPolicies: null,
            notFound: false,
            tabValue: "Social Sites",
            comment: '',
            commentList: null
        };
        this.api_uuid = this.props.match.params.api_uuid;
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    componentDidMount() {
        const api = new Api();
        let promised_api = api.getAPIById(this.api_uuid);
        promised_api.then(
            response => {
                this.setState({api: response.obj});
                this.props.setDetailsAPI(response.obj);
            }
        ).catch(
            error => {
                if (process.env.NODE_ENV !== "production") {
                    console.log(error);
                }
                let status = error.status;
                if (status === 404) {
                    this.setState({notFound: true});
                }
            }
        );

        let promised_applications = api.getAllApplications();
        promised_applications.then(
            response => {
                this.setState({applications: response.obj.list});
            }
        ).catch(
            error => {
                if (process.env.NODE_ENV !== "production") {
                    console.log(error);
                }
                let status = error.status;
                if (status === 404) {
                    this.setState({notFound: true});
                }
            }
        );

        let promised_subscriptions = api.getSubscriptions(this.api_uuid, null);
        promised_subscriptions.then(
            response => {

            }
        ).catch(
            error => {
                if (process.env.NODE_ENV !== "production") {
                    console.log(error);
                }
                let status = error.status;
                if (status === 404) {
                    this.setState({notFound: true});
                }
            }
        );
    }

    handleClick() {
        this.setState({redirect: true});
    }

    handleTabChange = (event, tabValue) => {
        this.setState({tabValue: tabValue});
    };

    render() {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        if (this.state.notFound) {
            return <ResourceNotFound/>
        }

        if (this.state.redirect) {
            return <Redirect push to="/application-create"/>;
        }
        const api = this.state.api;

        return (
            this.state.api ?
                <Paper>
                    <BasicInfo uuid={this.props.match.params.api_uuid}/>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                            { api.endpoint &&
                            api.endpoint.map(ep => <div>
                                <span>{ep.type}</span>
                                <span>{ep.inline ? ep.inline.endpointConfig.serviceUrl : ''}</span>
                            </div>)
                            }
                        </Grid>
                    </Grid>
                </Paper>
                : <Loading/>
        );
    }
}

export default Overview
