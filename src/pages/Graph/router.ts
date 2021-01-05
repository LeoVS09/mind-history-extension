import qs from 'query-string'
import { useLocation } from 'react-router-dom'

export function useQuery() {
    return qs.parse(useLocation().search)
}