# -*- coding:utf-8 -*-

import os
import socket
import time


class adbShell():
	"""adb shell的类"""

    #发送adb命令
	def adb_send_command(self, command):
		"""adb发送指令"""
		self.socket.sendall(b'%04x' % (len(command)))
		self.socket.sendall(command.encode())

    #adb shell发送命令
	def adbshell_send_command(self, command):
		"""adb shell 发送指令"""
		req_msg = 'shell:%s' % (command)
		self.adb_send_command(req_msg)
    
    #adb接收数据个数
	def adb_recvice(self, count):
		"""adb接收count个数据"""
		return self.socket.recv(count)

    #adb接收完整数据
	def adb_recvice_data(self):
		"""adb接收完整的数据"""
		resp = self.adb_recvice(4)
		if b'OKAY' != resp:
			return 1, resp
		rbuf = b''  # 以字符串的形式呈现
		count = 0
		while True:
			try:
				resp = self.adb_recvice(4096)
			except socket.error as e:
				if 5 == count:
					break  # 超时的时候也退出
				else:
					count += 1  # 多等几次吧
					continue
			else:
				if 0 == len(resp):  # recv函数返回值为字符串,只能通过判断字符串长度来确定是否有数据接收
					break
				else:
					rbuf += resp
		return 0, rbuf

    #adb连接
	def adb_connect(self):
		"""创建链接"""
		self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.socket.settimeout(5)
		count = 0
		while True:
			try:
				self.socket.connect(('127.0.0.1', 5037))
			except:
				if 5 != count:
					# 尝试连接5次
					os.system('adb start-server')
					count = count + 1
					continue
				else:
					return 'ERRO'
			else:
				break
		req_msg = 'host:transport-any'
		self.adb_send_command(req_msg)
		resp = self.adb_recvice(4)
		return resp  # 只返回结果,不进行判断

	def adb_server(self, command):
		"""adb服务"""
		is_connected = self.adb_connect()
		if b'OKAY' != is_connected:
			return [1, 'Can not connect to any devices']
		self.adbshell_send_command(command)
		error_code, recv_data = self.adb_recvice_data()
		return error_code, recv_data


#dump 指定so库的内存
def dumpRange(start, end):
	dumpName = hex(start).replace("0x", "")+"_"+hex(end).replace("0x", "")+".bin"
	filePath = f"/sdcard/{pid}/{dumpName}"
	command = f"adb shell su -c dd if=/proc/{pid}/mem of={filePath} skip={start} ibs=1 count={end - start}"
	os.system(command)
	command2 = f"adb pull /sdcard/{pid}/{dumpName} {pid}"
	os.system(command2)

#e6cd6000-e6cda000
def dumpRangeV2(range):
	start = int(range.split("-")[0], 16)
	end = int(range.split("-")[1], 16)
	dumpRange(start, end)


pid = 24662
name = "com.nike.omega"

shell = adbShell()		
if os.path.exists(f'{pid}') == False:
	shell.adb_server(f"su -c mkdir /sdcard/{pid}")
	os.makedirs(f'{pid}')
	maps = shell.adb_server(f'su -c cat /proc/{pid}/maps')[1].decode()
	with open(f'{pid}/maps.log', 'w', encoding="UTF-8") as f:
		f.write(maps)







#dump 指定内存
# dumpRange(0xe8040000, 0xe8380000)

dumpRangeV2("bdd1d000-c5f1d000")


'''
使用说明：
1.修改pid和name为当前需要dump的App进程ID和App包名；
2.运行脚本，会在脚本执行的当前目录下生成一个以pid命名的文件夹，文件夹内包含maps.log文件，用于查看进程内存地址；

'''