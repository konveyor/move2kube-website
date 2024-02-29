(()=>{"use strict";const e=58;class t{static read_bytes(e,n){const r=new t;return r.buf=e.getUint32(n,!0),r.buf_len=e.getUint32(n+4,!0),r}static read_bytes_array(e,n,r){const s=[];for(let o=0;o<r;o++)s.push(t.read_bytes(e,n+8*o));return s}}class n{static read_bytes(e,t){const r=new n;return r.buf=e.getUint32(t,!0),r.buf_len=e.getUint32(t+4,!0),r}static read_bytes_array(e,t,r){const s=[];for(let o=0;o<r;o++)s.push(n.read_bytes(e,t+8*o));return s}}class r{head_length(){return 24}name_length(){return this.dir_name.byteLength}write_head_bytes(e,t){e.setBigUint64(t,this.d_next,!0),e.setBigUint64(t+8,this.d_ino,!0),e.setUint32(t+16,this.dir_name.length,!0),e.setUint8(t+20,this.d_type)}write_name_bytes(e,t,n){e.set(this.dir_name.slice(0,Math.min(this.dir_name.byteLength,n)),t)}constructor(e,t,n){this.d_ino=1n;const r=(new TextEncoder).encode(t);this.d_next=e,this.d_namlen=r.byteLength,this.d_type=n,this.dir_name=r}}class s{write_bytes(e,t){e.setUint8(t,this.fs_filetype),e.setUint16(t+2,this.fs_flags,!0),e.setBigUint64(t+8,this.fs_rights_base,!0),e.setBigUint64(t+16,this.fs_rights_inherited,!0)}constructor(e,t){this.fs_rights_base=0n,this.fs_rights_inherited=0n,this.fs_filetype=e,this.fs_flags=t}}class o{write_bytes(e,t){e.setBigUint64(t,this.dev,!0),e.setBigUint64(t+8,this.ino,!0),e.setUint8(t+16,this.filetype),e.setBigUint64(t+24,this.nlink,!0),e.setBigUint64(t+32,this.size,!0),e.setBigUint64(t+38,this.atim,!0),e.setBigUint64(t+46,this.mtim,!0),e.setBigUint64(t+52,this.ctim,!0)}constructor(e,t){this.dev=0n,this.ino=0n,this.nlink=0n,this.atim=0n,this.mtim=0n,this.ctim=0n,this.filetype=e,this.size=t}}class i{write_bytes(e,t){e.setUint32(t,this.pr_name_len,!0)}constructor(e){this.pr_name_len=e}}class a{static dir(e){const t=new a;return t.tag=0,t.inner=new i(e),t}write_bytes(e,t){e.setUint32(t,this.tag,!0),this.inner.write_bytes(e,t+4)}}const l=new class{enable(e){this.log=function(e,t){return e?console.log.bind(console,"%c%s","color: #265BA0",t):()=>{}}(void 0===e||e,this.prefix)}get enabled(){return this.isEnabled}constructor(e){this.isEnabled=e,this.prefix="wasi:",this.enable(e)}}(!1);class f extends Error{constructor(e){super("exit with exit code "+e),this.code=e}}let d=class{start(e){this.inst=e;try{return e.exports._start(),0}catch(e){if(e instanceof f)return e.code;throw e}}initialize(e){this.inst=e,e.exports._initialize()}constructor(e,r,s,o={}){this.args=[],this.env=[],this.fds=[],l.enable(o.debug),this.args=e,this.env=r,this.fds=s;const i=this;this.wasiImport={args_sizes_get(e,t){const n=new DataView(i.inst.exports.memory.buffer);n.setUint32(e,i.args.length,!0);let r=0;for(const e of i.args)r+=e.length+1;return n.setUint32(t,r,!0),l.log(n.getUint32(e,!0),n.getUint32(t,!0)),0},args_get(e,t){const n=new DataView(i.inst.exports.memory.buffer),r=new Uint8Array(i.inst.exports.memory.buffer),s=t;for(let s=0;s<i.args.length;s++){n.setUint32(e,t,!0),e+=4;const o=(new TextEncoder).encode(i.args[s]);r.set(o,t),n.setUint8(t+o.length,0),t+=o.length+1}return l.enabled&&l.log(new TextDecoder("utf-8").decode(r.slice(s,t))),0},environ_sizes_get(e,t){const n=new DataView(i.inst.exports.memory.buffer);n.setUint32(e,i.env.length,!0);let r=0;for(const e of i.env)r+=e.length+1;return n.setUint32(t,r,!0),l.log(n.getUint32(e,!0),n.getUint32(t,!0)),0},environ_get(e,t){const n=new DataView(i.inst.exports.memory.buffer),r=new Uint8Array(i.inst.exports.memory.buffer),s=t;for(let s=0;s<i.env.length;s++){n.setUint32(e,t,!0),e+=4;const o=(new TextEncoder).encode(i.env[s]);r.set(o,t),n.setUint8(t+o.length,0),t+=o.length+1}return l.enabled&&l.log(new TextDecoder("utf-8").decode(r.slice(s,t))),0},clock_res_get(e,t){let n;switch(e){case 1:n=5000n;break;case 0:n=1000000n;break;default:return 52}return new DataView(i.inst.exports.memory.buffer).setBigUint64(t,n,!0),0},clock_time_get(e,t,n){const r=new DataView(i.inst.exports.memory.buffer);if(0===e)r.setBigUint64(n,1000000n*BigInt((new Date).getTime()),!0);else if(1==e){let e;try{e=BigInt(Math.round(1e6*performance.now()))}catch(t){e=0n}r.setBigUint64(n,e,!0)}else r.setBigUint64(n,0n,!0);return 0},fd_advise:(e,t,n,r)=>null!=i.fds[e]?i.fds[e].fd_advise(t,n,r):8,fd_allocate:(e,t,n)=>null!=i.fds[e]?i.fds[e].fd_allocate(t,n):8,fd_close(e){if(null!=i.fds[e]){const t=i.fds[e].fd_close();return i.fds[e]=void 0,t}return 8},fd_datasync:e=>null!=i.fds[e]?i.fds[e].fd_datasync():8,fd_fdstat_get(e,t){if(null!=i.fds[e]){const{ret:n,fdstat:r}=i.fds[e].fd_fdstat_get();return null!=r&&r.write_bytes(new DataView(i.inst.exports.memory.buffer),t),n}return 8},fd_fdstat_set_flags:(e,t)=>null!=i.fds[e]?i.fds[e].fd_fdstat_set_flags(t):8,fd_fdstat_set_rights:(e,t,n)=>null!=i.fds[e]?i.fds[e].fd_fdstat_set_rights(t,n):8,fd_filestat_get(e,t){if(null!=i.fds[e]){const{ret:n,filestat:r}=i.fds[e].fd_filestat_get();return null!=r&&r.write_bytes(new DataView(i.inst.exports.memory.buffer),t),n}return 8},fd_filestat_set_size:(e,t)=>null!=i.fds[e]?i.fds[e].fd_filestat_set_size(t):8,fd_filestat_set_times:(e,t,n,r)=>null!=i.fds[e]?i.fds[e].fd_filestat_set_times(t,n,r):8,fd_pread(e,n,r,s,o){const a=new DataView(i.inst.exports.memory.buffer),l=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const f=t.read_bytes_array(a,n,r),{ret:d,nread:c}=i.fds[e].fd_pread(l,f,s);return a.setUint32(o,c,!0),d}return 8},fd_prestat_get(e,t){const n=new DataView(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const{ret:r,prestat:s}=i.fds[e].fd_prestat_get();return null!=s&&s.write_bytes(n,t),r}return 8},fd_prestat_dir_name(e,t,n){if(null!=i.fds[e]){const{ret:n,prestat_dir_name:r}=i.fds[e].fd_prestat_dir_name();return null!=r&&new Uint8Array(i.inst.exports.memory.buffer).set(r,t),n}return 8},fd_pwrite(e,t,r,s,o){const a=new DataView(i.inst.exports.memory.buffer),l=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const f=n.read_bytes_array(a,t,r),{ret:d,nwritten:c}=i.fds[e].fd_pwrite(l,f,s);return a.setUint32(o,c,!0),d}return 8},fd_read(e,n,r,s){const o=new DataView(i.inst.exports.memory.buffer),a=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const l=t.read_bytes_array(o,n,r),{ret:f,nread:d}=i.fds[e].fd_read(a,l);return o.setUint32(s,d,!0),f}return 8},fd_readdir(e,t,n,r,s){const o=new DataView(i.inst.exports.memory.buffer),a=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){let l=0;for(;;){const{ret:f,dirent:d}=i.fds[e].fd_readdir_single(r);if(0!=f)return o.setUint32(s,l,!0),f;if(null==d)break;if(n-l<d.head_length()){l=n;break}const c=new ArrayBuffer(d.head_length());if(d.write_head_bytes(new DataView(c),0),a.set(new Uint8Array(c).slice(0,Math.min(c.byteLength,n-l)),t),t+=d.head_length(),l+=d.head_length(),n-l<d.name_length()){l=n;break}d.write_name_bytes(a,t,n-l),t+=d.name_length(),l+=d.name_length(),r=d.d_next}return o.setUint32(s,l,!0),0}return 8},fd_renumber(e,t){if(null!=i.fds[e]&&null!=i.fds[t]){const n=i.fds[t].fd_close();return 0!=n?n:(i.fds[t]=i.fds[e],i.fds[e]=void 0,0)}return 8},fd_seek(e,t,n,r){const s=new DataView(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const{ret:o,offset:a}=i.fds[e].fd_seek(t,n);return s.setBigInt64(r,a,!0),o}return 8},fd_sync:e=>null!=i.fds[e]?i.fds[e].fd_sync():8,fd_tell(e,t){const n=new DataView(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const{ret:r,offset:s}=i.fds[e].fd_tell();return n.setBigUint64(t,s,!0),r}return 8},fd_write(e,t,r,s){const o=new DataView(i.inst.exports.memory.buffer),a=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const l=n.read_bytes_array(o,t,r),{ret:f,nwritten:d}=i.fds[e].fd_write(a,l);return o.setUint32(s,d,!0),f}return 8},path_create_directory(e,t,n){const r=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const s=new TextDecoder("utf-8").decode(r.slice(t,t+n));return i.fds[e].path_create_directory(s)}},path_filestat_get(e,t,n,r,s){const o=new DataView(i.inst.exports.memory.buffer),a=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const l=new TextDecoder("utf-8").decode(a.slice(n,n+r)),{ret:f,filestat:d}=i.fds[e].path_filestat_get(t,l);return null!=d&&d.write_bytes(o,s),f}return 8},path_filestat_set_times(e,t,n,r,s,o,a){const l=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const f=new TextDecoder("utf-8").decode(l.slice(n,n+r));return i.fds[e].path_filestat_set_times(t,f,s,o,a)}return 8},path_link(e,t,n,r,s,o,a){const l=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]&&null!=i.fds[s]){const f=new TextDecoder("utf-8").decode(l.slice(n,n+r)),d=new TextDecoder("utf-8").decode(l.slice(o,o+a));return i.fds[s].path_link(e,t,f,d)}return 8},path_open(e,t,n,r,s,o,a,f,d){const c=new DataView(i.inst.exports.memory.buffer),u=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const _=new TextDecoder("utf-8").decode(u.slice(n,n+r));l.log(_);const{ret:h,fd_obj:m}=i.fds[e].path_open(t,_,s,o,a,f);if(0!=h)return h;i.fds.push(m);const p=i.fds.length-1;return c.setUint32(d,p,!0),0}return 8},path_readlink(e,t,n,r,s,o){const a=new DataView(i.inst.exports.memory.buffer),f=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const d=new TextDecoder("utf-8").decode(f.slice(t,t+n));l.log(d);const{ret:c,data:u}=i.fds[e].path_readlink(d);if(null!=u){const e=(new TextEncoder).encode(u);if(e.length>s)return a.setUint32(o,0,!0),8;f.set(e,r),a.setUint32(o,e.length,!0)}return c}return 8},path_remove_directory(e,t,n){const r=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const s=new TextDecoder("utf-8").decode(r.slice(t,t+n));return i.fds[e].path_remove_directory(s)}return 8},path_rename(e,t,n,r,s,o){throw"FIXME what is the best abstraction for this?"},path_symlink(e,t,n,r,s){const o=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[n]){const a=new TextDecoder("utf-8").decode(o.slice(e,e+t)),l=new TextDecoder("utf-8").decode(o.slice(r,r+s));return i.fds[n].path_symlink(a,l)}return 8},path_unlink_file(e,t,n){const r=new Uint8Array(i.inst.exports.memory.buffer);if(null!=i.fds[e]){const s=new TextDecoder("utf-8").decode(r.slice(t,t+n));return i.fds[e].path_unlink_file(s)}return 8},poll_oneoff(e,t,n){throw"async io not supported"},proc_exit(e){throw new f(e)},proc_raise(e){throw"raised signal "+e},sched_yield(){},random_get(e,t){const n=new Uint8Array(i.inst.exports.memory.buffer);for(let r=0;r<t;r++)n[e+r]=256*Math.random()|0},sock_recv(e,t,n){throw"sockets not supported"},sock_send(e,t,n){throw"sockets not supported"},sock_shutdown(e,t){throw"sockets not supported"},sock_accept(e,t){throw"sockets not supported"}}}};class c{fd_advise(t,n,r){return e}fd_allocate(t,n){return e}fd_close(){return 0}fd_datasync(){return e}fd_fdstat_get(){return{ret:e,fdstat:null}}fd_fdstat_set_flags(t){return e}fd_fdstat_set_rights(t,n){return e}fd_filestat_get(){return{ret:e,filestat:null}}fd_filestat_set_size(t){return e}fd_filestat_set_times(t,n,r){return e}fd_pread(t,n,r){return{ret:e,nread:0}}fd_prestat_get(){return{ret:e,prestat:null}}fd_prestat_dir_name(){return{ret:e,prestat_dir_name:null}}fd_pwrite(t,n,r){return{ret:e,nwritten:0}}fd_read(t,n){return{ret:e,nread:0}}fd_readdir_single(t){return{ret:e,dirent:null}}fd_seek(t,n){return{ret:e,offset:0n}}fd_sync(){return 0}fd_tell(){return{ret:e,offset:0n}}fd_write(t,n){return{ret:e,nwritten:0}}path_create_directory(t){return e}path_filestat_get(t,n){return{ret:e,filestat:null}}path_filestat_set_times(t,n,r,s,o){return e}path_link(t,n,r,s){return e}path_open(t,n,r,s,o,i){return{ret:e,fd_obj:null}}path_readlink(t){return{ret:e,data:null}}path_remove_directory(t){return e}path_rename(t,n,r){return e}path_symlink(t,n){return e}path_unlink_file(t){return e}}class u extends c{fd_fdstat_get(){return{ret:0,fdstat:new s(4,0)}}fd_read(e,t){let n=0;for(const r of t){if(!(this.file_pos<this.file.data.byteLength))break;{const t=this.file.data.slice(Number(this.file_pos),Number(this.file_pos+BigInt(r.buf_len)));e.set(t,r.buf),this.file_pos+=BigInt(t.length),n+=t.length}}return{ret:0,nread:n}}fd_pread(e,t,n){let r=0;for(const s of t){if(!(n<this.file.data.byteLength))break;{const t=this.file.data.slice(Number(n),Number(n+BigInt(s.buf_len)));e.set(t,s.buf),n+=BigInt(t.length),r+=t.length}}return{ret:0,nread:r}}fd_seek(e,t){let n;switch(t){case 0:n=e;break;case 1:n=this.file_pos+e;break;case 2:n=BigInt(this.file.data.byteLength)+e;break;default:return{ret:28,offset:0n}}return n<0?{ret:28,offset:0n}:(this.file_pos=n,{ret:0,offset:this.file_pos})}fd_tell(){return{ret:0,offset:this.file_pos}}fd_write(e,t){let n=0;if(this.file.readonly)return{ret:8,nwritten:n};for(const r of t){const t=e.slice(r.buf,r.buf+r.buf_len);if(this.file_pos+BigInt(t.byteLength)>this.file.size){const e=this.file.data;this.file.data=new Uint8Array(Number(this.file_pos+BigInt(t.byteLength))),this.file.data.set(e)}this.file.data.set(t.slice(0,Number(this.file.size-this.file_pos)),Number(this.file_pos)),this.file_pos+=BigInt(t.byteLength),n+=r.buf_len}return{ret:0,nwritten:n}}fd_pwrite(e,t,n){let r=0;if(this.file.readonly)return{ret:8,nwritten:r};for(const s of t){const t=e.slice(s.buf,s.buf+s.buf_len);if(n+BigInt(t.byteLength)>this.file.size){const e=this.file.data;this.file.data=new Uint8Array(Number(n+BigInt(t.byteLength))),this.file.data.set(e)}this.file.data.set(t.slice(0,Number(this.file.size-n)),Number(n)),n+=BigInt(t.byteLength),r+=s.buf_len}return{ret:0,nwritten:r}}fd_filestat_get(){return{ret:0,filestat:this.file.stat()}}constructor(e){super(),this.file_pos=0n,this.file=e}}class _ extends c{fd_fdstat_get(){return{ret:0,fdstat:new s(3,0)}}fd_readdir_single(e){if(l.enabled&&(l.log("readdir_single",e),l.log(e,Object.keys(this.dir.contents))),l.log(e,Object.keys(this.dir.contents).slice(Number(e))),e>=BigInt(Object.keys(this.dir.contents).length))return{ret:0,dirent:null};const t=Object.keys(this.dir.contents)[Number(e)],n=this.dir.contents[t];return{ret:0,dirent:new r(e+1n,t,n.stat().filetype)}}path_filestat_get(e,t){const n=this.dir.get_entry_for_path(t);return null==n?{ret:44,filestat:null}:{ret:0,filestat:n.stat()}}path_open(e,t,n,r,s,o){let i=this.dir.get_entry_for_path(t);if(null==i){if(1!=(1&n))return{ret:44,fd_obj:null};i=this.dir.create_entry_for_path(t,2==(2&n))}else if(4==(4&n))return{ret:20,fd_obj:null};if(2==(2&n)&&3!==i.stat().filetype)return{ret:54,fd_obj:null};if(i.readonly&&(r&BigInt(64))==BigInt(64))return{ret:63,fd_obj:null};if(!(i instanceof p)&&8==(8&n)){const e=i.truncate();if(0!=e)return{ret:e,fd_obj:null}}return{ret:0,fd_obj:i.open(o)}}path_create_directory(e){return this.path_open(0,e,3,0n,0n,0).ret}path_unlink_file(e){e=this.clean_path(e);const t=this.dir.get_parent_dir_for_path(e),n=e.split("/"),r=n[n.length-1],s=this.dir.get_entry_for_path(e);return null===s?44:3===s.stat().filetype?31:(delete t.contents[r],0)}path_remove_directory(e){e=this.clean_path(e);const t=this.dir.get_parent_dir_for_path(e),n=e.split("/"),r=n[n.length-1],s=this.dir.get_entry_for_path(e);return null===s?44:s instanceof p&&3===s.stat().filetype?0!==Object.keys(s.contents).length?55:void 0===t.contents[r]?44:(delete t.contents[r],0):54}clean_path(e){for(;e.length>0&&"/"===e[e.length-1];)e=e.slice(0,e.length-1);return e}constructor(e){super(),this.dir=e}}class h extends _{fd_prestat_get(){return{ret:0,prestat:a.dir(this.prestat_name.length)}}fd_prestat_dir_name(){return{ret:0,prestat_dir_name:this.prestat_name}}constructor(e,t){super(new p(t)),this.prestat_name=(new TextEncoder).encode(e)}}class m{open(e){const t=new u(this);return 1&e&&t.fd_seek(0n,2),t}get size(){return BigInt(this.data.byteLength)}stat(){return new o(4,this.size)}truncate(){return this.readonly?63:(this.data=new Uint8Array([]),0)}constructor(e,t){this.data=new Uint8Array(e),this.readonly=!!t?.readonly}}class p{open(e){return new _(this)}stat(){return new o(3,0n)}get_entry_for_path(e){let t=this;for(const n of e.split("/")){if(""==n)break;if("."!=n){if(!(t instanceof p))return null;if(null==t.contents[n])return l.log(n),null;t=t.contents[n]}}return t}get_parent_dir_for_path(e){if(""===e)return null;let t=this,n=t;for(const r of e.split("/")){if(""===r)break;if("."!==r){if(!(t instanceof p))return l.log(t),null;if(void 0===t.contents[r])return l.log(r),null;n=t,t=t.contents[r]}}return n}create_entry_for_path(e,t){let n=this;const r=e.split("/").filter((e=>"/"!=e));for(let e=0;e<r.length;e++){const s=r[e];if(!(n instanceof p))break;null!=n.contents[s]||(l.log("create",s),e!=r.length-1||t?n.contents[s]=new p({}):n.contents[s]=new m(new ArrayBuffer(0))),n=n.contents[s]}return n}constructor(e){this.readonly=!1,this.contents=e}}class g extends c{constructor(){super()}fd_write(e,t){let n=0;for(let r of t){const t=e.slice(r.buf,r.buf+r.buf_len);self.postMessage({type:w,payload:t}),n+=r.buf_len}return{ret:0,nwritten:n}}}const w="terminal-print",y="transform-error",b="wasi_snapshot_preview1";let x=null,U=null,k=null;const D=(e,t,n,r)=>(console.log("poll_oneoff in_, out, nsubscriptions, nevents",e,t,n,r),0),B=(e,t,n,r)=>(console.log("sock_accept sock, fd_flags, ro_fd, ro_addr",e,t,n,r),0),A=async e=>{console.log("processMessage start");try{const t=e.data;switch(console.log("got a message:",t),t.type){case"initialize-worker":{console.log("MSG_INIT_WORKER payload:",t.payload);const{sab:e}=t.payload;console.log("sab",e),e&&(x=new Uint8Array(e),U=new Int32Array(e)),self.postMessage({type:"worker-initialized"});break}case"wasm-module":{console.log("got a wasm module:",typeof t.payload,t.payload);const{wasmModule:n,srcFilename:r,srcContents:s,custFilename:o,custContents:i,configFilename:a,configContents:l,qaSkip:f}=t.payload,c=["move2kube","transform","--source",r,"--output","my-m2k-output"],u={[r]:new m(s)};f&&c.push("--qa-skip"),o&&i&&(c.push("--customizations",o),u[o]=new m(i)),a&&l&&(c.push("--config",a),u[a]=new m(l));const _=[],w=[new g,new g,new g,new h("/",u)];k=w;const A=new d(c,_,w,{debug:!1}),E=A.wasiImport;E.poll_oneoff=D,E.sock_accept=B;const I=new d(c,_,w,{debug:!1}),T=I.wasiImport;T.poll_oneoff=D,T.sock_accept=B;let v=null;const M=(e,t)=>{if(!v)throw new Error("load_string: the wasm instance is missing");const n=new Uint8Array(v.exports.memory.buffer).slice(e,e+t);return{buf:n,s:new TextDecoder("utf-8").decode(n)}},z=(e,t)=>{if(!v)throw new Error("store_bytes: the wasm instance is missing");new Uint8Array(v.exports.memory.buffer).set(e,t)};let V=41;const j={},L=(e,t)=>{const{s:n}=M(e,t),r=w[3];console.log("[DEBUG] load_wasm_module called with path:",n,"preOpenedFd:",r);let s=r.dir.contents;if(n.split("/").forEach((e=>{if(""!==e){if(!(e in s))throw console.error("load_wasm_module: p",e,"currDirectoryOrFile",s),new Error("load_wasm_module: failed to find the wasm module");s=s[e],s instanceof h?s=s.dir.contents:s instanceof p&&(s=s.contents)}})),!(s instanceof m))throw new Error("load_wasm_module: the given path is not a file");const o=s.data;console.log("load_wasm_module: wasmModuleBytes",o);const i=new WebAssembly.Module(o),a={[b]:T},l=new WebAssembly.Instance(i,a);console.log("load_wasm_module wasi.start start"),I.start(l),console.log("load_wasm_module wasi.start done");const f=++V;return console.log("load_wasm_module: compiled wasm and made an instance:",l,"module id:",f),j[f]=l,f},N=e=>(t,n,r,s)=>{if(!(t in j))throw new Error(`There is no wasm module with id ${t}`);console.log("[DEBUG] run_transform is_dir_detect:",e);const o=j[t],{buf:i,s:a}=M(n,r);console.log("run_transform: load_string buf",i),JSON.parse(a),console.log("run_transform called with: wasmModuleId:",t,"wasmModule",o),console.log("wasmModule.exports.myAllocate",o.exports.myAllocate),console.log("wasmModule.exports.RunDirectoryDetect",o.exports.RunDirectoryDetect),console.log("wasmModule.exports.RunTransform",o.exports.RunTransform);const l=i.byteLength;console.log("run_transform: allocate some memory of size:",l);const f=o.exports.myAllocate(l);if(console.log("run_transform: ptr",f,"len",l),f<0)throw new Error("failed to allocate, invalid pointer into memory");let d=new Uint8Array(o.exports.memory.buffer);d.set(i,f),console.log("run_transform: json input set at ptr",f),console.log("run_transform: allocate space for the output pointers");const c=o.exports.myAllocate(8);if(console.log("run_transform: ptrptr",c),c<0)throw new Error("failed to allocate, invalid pointer into memory");if(e){console.log("calling custom transformer directory detect");const e=o.exports.RunDirectoryDetect(f,l,c,c+4);if(console.log("run_transform: directory detect result",e),e<0)throw new Error("run_transform: directory detect failed")}else{console.log("calling custom transformer transform");const e=o.exports.RunTransform(f,l,c,c+4);if(console.log("run_transform: transformation result",e),e<0)throw new Error("run_transform: transformation failed")}const u=new DataView(o.exports.memory.buffer,c,4).getUint32(0,!0),_=new DataView(o.exports.memory.buffer,c+4,4).getUint32(0,!0);console.log("run_transform: transformation outJsonPtr",u,"outJsonLen",_),d=new Uint8Array(o.exports.memory.buffer),console.log("run_transform: memory",d);const h=d.slice(u,u+_);console.log("run_transform: outJsonBytes",h);const m=new TextDecoder("utf-8").decode(h);console.log("run_transform: outJson",m);const p=JSON.parse(m);return console.log("run_transform: outJsonParsed",p),z(h,s),h.length},O=(e,t,n)=>{if(n<0)throw new Error("the output pointer is an invalid pointer into memory");const{s:r}=M(e,t),s=JSON.parse(r);console.log("ask the main thread to ask the question:",s),self.postMessage({type:"ask-question",payload:s}),console.log("ask_question: wait until the question is answered");const o=Atomics.wait(U,0,0);if(console.log("ask_question: waitOk:",o),"ok"!==o)throw new Error(`Atomics.wait failed waitOk: ${o}`);const i=((e,t)=>{const n=t[1];if(n<=0)throw new Error("object length is zero or negative");const r=e.slice(8,8+n),s=(new TextDecoder).decode(r);return JSON.parse(s)})(x,U);console.log("got an answer from main thread, ans:",i);const a=JSON.stringify(i),l=(new TextEncoder).encode(a);return z(l,n),l.byteLength},R={[b]:E,mym2kmodule:{load_wasm_module:L,run_dir_detect:N(!0),run_transform:N(!1),ask_question:O}},S=performance.now(),J=await WebAssembly.instantiate(n,R),q=performance.now(),F=q-S,G=F/1e3;console.log("tInstantiateStart",S,"tInstantiateEnd",q,"tInstantiate",F,"tInstantiateSeconds",G),v=J,console.log("wasmModuleInstance",J),console.log("wasmModuleInstance.exports",J.exports),console.log("wasmModuleInstance.exports.memory.buffer",J.exports.memory.buffer);try{const e=performance.now(),t=A.start(J),n=performance.now(),r=n-e,s=r/1e3;if(console.log("tTransformStart",e,"tTransformEnd",n,"tTransform",r,"tTransformSeconds",s),console.log("exitCode:",t),0!==t){const e=`got a non-zero exit code: ${t}`;console.error(e,"DEBUG fds:",k),self.postMessage({type:y,payload:e});break}const o=w[3]?.dir?.contents["myproject.zip"]?.data?.buffer;if(!o){self.postMessage({type:y,payload:'The output "myproject.zip" file is missing.'}),console.log("ERROR myproject.zip is missing, DEBUG fds:",k);break}self.postMessage({type:"transform-done",payload:{myprojectzip:o,tTransform:r}})}catch(e){console.error("the wasm module finished with an error:",e,"DEBUG fds:",k);const t=`${e}`;self.postMessage({type:y,payload:t})}break}default:throw new Error(`unknown message type: ${t.type}`)}}catch(e){console.error("failed to process the message. error:",e)}console.log("processMessage end")};(()=>{const e=console.log;console.log=(...t)=>e("[worker]",...t);const t=console.error;console.error=(...e)=>t("[worker]",...e),console.log("main start"),self.addEventListener("message",A),console.log("main end")})()})();