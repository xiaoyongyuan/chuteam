import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import AllComponents from '../views'
import menuConfig from '../config/menuConfig';
import queryString from 'query-string';
export default class MyRouter extends Component {
    render() {
        return (
            <Switch>
                {
                    Object.keys(menuConfig).map(key => {
                        return menuConfig[key].map(r => {
                            const route = r => {
                                const Component = AllComponents[r.component];
                                return (
                                    <Route
                                        key={r.route || r.key}
                                        exact
                                        path={r.route || r.key}
                                        render={props => {
                                            const reg = /\?\S*/g;
                                            // 匹配?及其以后字符串
                                            const queryParams = window.location.hash.match(reg);
                                            // 去除?的参数
                                            const { params } = props.match;
                                            Object.keys(params).forEach(key => {
                                                params[key] = params[key] && params[key].replace(reg, '');
                                            });
                                            props.match.params = { ...params };
                                            const merge = { ...props, query: queryParams ? queryString.parse(queryParams[0]) : {} };
                                            return <Component {...merge} />
                                        }}
                                    />
                                )
                            }
                            return r.component ? route(r) : r.children.map(res => {
                                return res.component ? route(res) : res.children.map(el => route(el))
                            });
                        })
                    })
                }
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}