import type {ComponentType} from 'react';
import data from './data.json';
import {Comparison as CMG013, validateComparison as VMG013} from '../pilots/P01/Comparison';
import {Template as CMG016, validateProps as VMG016} from '../batch/MG-016/model';
import {Template as CMG017, validateProps as VMG017} from '../batch/MG-017/model';
import {Template as CMG018, validateProps as VMG018} from '../batch/MG-018/model';
import {Template as CMG019, validateProps as VMG019} from '../batch/MG-019/model';
import {Template as CMG020, validateProps as VMG020} from '../batch/MG-020/model';
import {Template as CMG021, validateProps as VMG021} from '../batch/MG-021/model';
import {Template as CMG022, validateProps as VMG022} from '../batch/MG-022/model';
import {Template as CMG023, validateProps as VMG023} from '../batch/MG-023/model';
import {Template as CMG024, validateProps as VMG024} from '../batch/MG-024/model';
import {Template as CMG025, validateProps as VMG025} from '../batch/MG-025/model';
import {Template as CMG026, validateProps as VMG026} from '../batch/MG-026/model';
import {Template as CMG027, validateProps as VMG027} from '../batch/MG-027/model';
import {Template as CMG028, validateProps as VMG028} from '../batch/MG-028/model';
import {Template as CMG029, validateProps as VMG029} from '../batch/MG-029/model';
import {Template as CMG030, validateProps as VMG030} from '../batch/MG-030/model';
import {Template as CMG031, validateProps as VMG031} from '../batch/MG-031/model';
import {Template as CMG032, validateProps as VMG032} from '../batch/MG-032/model';
import {Template as CMG033, validateProps as VMG033} from '../batch/MG-033/model';
import {TableFocus as CMG014, validateTableFocus as VMG014} from '../pilots/P02/model';
import {Template as CMG034, validateProps as VMG034} from '../batch/MG-034/model';
import {Template as CMG035, validateProps as VMG035} from '../batch/MG-035/model';
import {Template as CMG036, validateProps as VMG036} from '../batch/MG-036/model';
import {Template as CMG037, validateProps as VMG037} from '../batch/MG-037/model';
import {Template as CMG038, validateProps as VMG038} from '../batch/MG-038/model';
import {Template as CMG039, validateProps as VMG039} from '../batch/MG-039/model';
import {Template as CMG040, validateProps as VMG040} from '../batch/MG-040/model';
import {Template as CMG041, validateProps as VMG041} from '../batch/MG-041/model';
import {Template as CMG042, validateProps as VMG042} from '../batch/MG-042/model';
import {Template as CMG043, validateProps as VMG043} from '../batch/MG-043/model';
import {Template as CMG044, validateProps as VMG044} from '../batch/MG-044/model';
import {AgentForm as CMG015, validateP03 as VMG015} from '../pilots/P03/AgentForm';
import {Template as CMG045, validateProps as VMG045} from '../batch/MG-045/model';
import {Template as CMG046, validateProps as VMG046} from '../batch/MG-046/model';
import {Template as CMG047, validateProps as VMG047} from '../batch/MG-047/model';
import {Template as CMG048, validateProps as VMG048} from '../batch/MG-048/model';
import {Template as CMG049, validateProps as VMG049} from '../batch/MG-049/model';
import {Template as CMG050, validateProps as VMG050} from '../batch/MG-050/model';
import {Template as CMG051, validateProps as VMG051} from '../batch/MG-051/model';
import {Template as CMG052, validateProps as VMG052} from '../batch/MG-052/model';
import {Template as CMG053, validateProps as VMG053} from '../batch/MG-053/model';
import {Template as CMG054, validateProps as VMG054} from '../batch/MG-054/model';
import {Template as CMG055, validateProps as VMG055} from '../batch/MG-055/model';
import {Template as CMG056, validateProps as VMG056} from '../batch/MG-056/model';
import {Template as CMG057, validateProps as VMG057} from '../batch/MG-057/model';
import {Template as CMG058, validateProps as VMG058} from '../batch/MG-058/model';
import {Template as CMG059, validateProps as VMG059} from '../batch/MG-059/model';
import {Template as CMG060, validateProps as VMG060} from '../batch/MG-060/model';
import {Template as CMG061, validateProps as VMG061} from '../batch/MG-061/model';
import {Template as CMG062, validateProps as VMG062} from '../batch/MG-062/model';
export type Descriptor={Component:ComponentType<any>;validate:(p:any)=>any;reference:any;usage:any;referenceDuration:number;usageDuration:number;durationKey:string|null;fixedDuration:number|null;minDuration:number|null};
export const registry:Record<string,Descriptor>={
  'MG-013': {Component:CMG013, validate:VMG013, ...data['MG-013']},
  'MG-016': {Component:CMG016, validate:VMG016, ...data['MG-016']},
  'MG-017': {Component:CMG017, validate:VMG017, ...data['MG-017']},
  'MG-018': {Component:CMG018, validate:VMG018, ...data['MG-018']},
  'MG-019': {Component:CMG019, validate:VMG019, ...data['MG-019']},
  'MG-020': {Component:CMG020, validate:VMG020, ...data['MG-020']},
  'MG-021': {Component:CMG021, validate:VMG021, ...data['MG-021']},
  'MG-022': {Component:CMG022, validate:VMG022, ...data['MG-022']},
  'MG-023': {Component:CMG023, validate:VMG023, ...data['MG-023']},
  'MG-024': {Component:CMG024, validate:VMG024, ...data['MG-024']},
  'MG-025': {Component:CMG025, validate:VMG025, ...data['MG-025']},
  'MG-026': {Component:CMG026, validate:VMG026, ...data['MG-026']},
  'MG-027': {Component:CMG027, validate:VMG027, ...data['MG-027']},
  'MG-028': {Component:CMG028, validate:VMG028, ...data['MG-028']},
  'MG-029': {Component:CMG029, validate:VMG029, ...data['MG-029']},
  'MG-030': {Component:CMG030, validate:VMG030, ...data['MG-030']},
  'MG-031': {Component:CMG031, validate:VMG031, ...data['MG-031']},
  'MG-032': {Component:CMG032, validate:VMG032, ...data['MG-032']},
  'MG-033': {Component:CMG033, validate:VMG033, ...data['MG-033']},
  'MG-014': {Component:CMG014, validate:VMG014, ...data['MG-014']},
  'MG-034': {Component:CMG034, validate:VMG034, ...data['MG-034']},
  'MG-035': {Component:CMG035, validate:VMG035, ...data['MG-035']},
  'MG-036': {Component:CMG036, validate:VMG036, ...data['MG-036']},
  'MG-037': {Component:CMG037, validate:VMG037, ...data['MG-037']},
  'MG-038': {Component:CMG038, validate:VMG038, ...data['MG-038']},
  'MG-039': {Component:CMG039, validate:VMG039, ...data['MG-039']},
  'MG-040': {Component:CMG040, validate:VMG040, ...data['MG-040']},
  'MG-041': {Component:CMG041, validate:VMG041, ...data['MG-041']},
  'MG-042': {Component:CMG042, validate:VMG042, ...data['MG-042']},
  'MG-043': {Component:CMG043, validate:VMG043, ...data['MG-043']},
  'MG-044': {Component:CMG044, validate:VMG044, ...data['MG-044']},
  'MG-015': {Component:CMG015, validate:VMG015, ...data['MG-015']},
  'MG-045': {Component:CMG045, validate:VMG045, ...data['MG-045']},
  'MG-046': {Component:CMG046, validate:VMG046, ...data['MG-046']},
  'MG-047': {Component:CMG047, validate:VMG047, ...data['MG-047']},
  'MG-048': {Component:CMG048, validate:VMG048, ...data['MG-048']},
  'MG-049': {Component:CMG049, validate:VMG049, ...data['MG-049']},
  'MG-050': {Component:CMG050, validate:VMG050, ...data['MG-050']},
  'MG-051': {Component:CMG051, validate:VMG051, ...data['MG-051']},
  'MG-052': {Component:CMG052, validate:VMG052, ...data['MG-052']},
  'MG-053': {Component:CMG053, validate:VMG053, ...data['MG-053']},
  'MG-054': {Component:CMG054, validate:VMG054, ...data['MG-054']},
  'MG-055': {Component:CMG055, validate:VMG055, ...data['MG-055']},
  'MG-056': {Component:CMG056, validate:VMG056, ...data['MG-056']},
  'MG-057': {Component:CMG057, validate:VMG057, ...data['MG-057']},
  'MG-058': {Component:CMG058, validate:VMG058, ...data['MG-058']},
  'MG-059': {Component:CMG059, validate:VMG059, ...data['MG-059']},
  'MG-060': {Component:CMG060, validate:VMG060, ...data['MG-060']},
  'MG-061': {Component:CMG061, validate:VMG061, ...data['MG-061']},
  'MG-062': {Component:CMG062, validate:VMG062, ...data['MG-062']}
};
