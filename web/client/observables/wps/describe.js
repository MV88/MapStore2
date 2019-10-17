import {getWPSURL} from './common';
import {Observable} from 'rxjs';
import axios from '../../libs/ajax';
import {interceptOGCError} from '../../utils/ObservableUtils';

export default {
    describeProcess: (url, identifier) =>
        Observable.defer( () => axios.get(getWPSURL(url, {
            "version": "1.0.0",
            "REQUEST": "DescribeProcess",
            "IDENTIFIER": identifier }), {
            timeout: 5000,
            headers: {'Accept': 'application/json', 'Content-Type': 'application/xml'}
        })).let(interceptOGCError)

};
