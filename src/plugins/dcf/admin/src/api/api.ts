import { Cause, CreateCauseDto } from '../types/cause';

const fetchCauses = async (get: Function) => {
    const {
        data: {
            data
        }
    } = await get('/dcf/causes?populate=association');
    return data;
}

const fetchDonations = async (get: Function) => {
    const {
        data: {
            data
        }
    } = await get('/dcf/donations?populate[0]=cause&populate[1]=company');
    return data;
}

const newCause = async (post: Function, causeData: CreateCauseDto) => {
    const {
        data: {
            data
        }
    } = await post('/dcf/causes', { data: causeData });
    return data;
}

export {
    fetchCauses,
    newCause,
    fetchDonations
}
