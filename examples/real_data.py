import pandas as pd
from scapy.all import rdpcap, TCP, UDP, IP, DNS, DNSQR

def detect_app_protocol(pkt):
    if TCP in pkt:
        sport = pkt[TCP].sport
        dport = pkt[TCP].dport

        if sport == 80 or dport == 80:
            return "HTTP"
        elif sport == 443 or dport == 443:
            return "HTTPS"
        elif sport == 21 or dport == 21:
            return "FTP"
        elif sport == 22 or dport == 22:
            return "SSH"
        elif sport == 25 or dport == 25:
            return "SMTP"
        
    if UDP in pkt:
        sport = pkt[UDP].sport
        dport = pkt[UDP].dport
        
        if sport == 53 or dport == 53:
            return "DNS"
    
    return "OTHER"


def pcap_to_dataframe(pcap_file):
    # read the .pcap file
    packets = rdpcap(pcap_file)

    rows = []
    
    # dictionaries to calculate latency
    tcp_syn_times = {} # TCP handshake
    http_times = {} # for HTTP/HTTPS: (src, dst,dport, protocol) -> timestamp first query
    dns_times = {} # for DNS: (id) -> timestamps querys

    for pkt in packets:
        # Just consider the IP packages
        if IP in pkt:
            ts = float(pkt.time)  # timestamp in seconds
            src_ip = pkt[IP].src
            dst_ip = pkt[IP].dst
            #proto = pkt[IP].proto
            #protocol = "TCP" if TCP in pkt else "UDP" if UDP in pkt else str(proto)
            protocol = detect_app_protocol(pkt)

            # destination port 
            dst_port = None
            if TCP in pkt:
                dst_port = pkt[TCP].dport
            elif UDP in pkt:
                dst_port = pkt[UDP].dport
            

            # Calculate latency
            latency_ms = None

            # TCP ANDSAKE LATENCY
            if TCP in pkt:

                flags = pkt[TCP].flags

                # SYN send
                if flags == "S":
                    key = (src_ip, dst_ip, pkt[TCP].sport, pkt[TCP].dport)
                    tcp_syn_times[key] = ts
                    latency_ms = 0

                # SYN-ACK recive
                elif flags == "SA":
                    key = (dst_ip, src_ip, pkt[TCP].dport, pkt[TCP].sport)

                    if key in tcp_syn_times:
                        latency_ms = (ts - tcp_syn_times[key]) * 1000
                        del tcp_syn_times[key]

            elif protocol in ["HTTP", "HTTPS", "FTP", "SSH", "SMTP"] and  TCP in pkt:
                key = (src_ip, dst_ip, dst_port, protocol)
                # query packae
                if key not in http_times: # if is the first time we see the package is the query package
                    http_times[key] = ts # asign the timestamp value to http_times[key]
                    latency_ms = 0
                else: # otherwise is the response package
                    #response package (aprox)
                    latency_ms = (ts - http_times[key]) * 1000
                    # it could be reset if you want multiple trasactions

            # we ceck if DNS is on packae (NOT COVER SNMP, DCP, etc )
            elif protocol == 'DNS' and UDP in pkt and DNS in pkt:
                dns_id = pkt[DNS].id # stores te DNS packae id in dns_id
                if pkt[DNS].qr == 0: # query
                    dns_times[dns_id] = ts # stores te timestamp on dns_times[dns_id]
                    latency_ms = 0
                else: # response packae (pkt[DNS].qr diferente de 0)
                    if dns_id in dns_times: # searc te correspondin consult to dns_id
                        latency_ms = (ts - dns_times[dns_id])*1000
                        del dns_times[dns_id] # remove dns_id frome dns_times
            elif protocol not in ["DNS", "HTTP", "HTTPS", "FTP", "SSH", "SMTP"]:
                latency_ms = float("nan") # establis Nan value to be inored by pandas and dont affect te baseline or tersold calculus

            rows.append({
                "timestamp": pd.to_datetime(ts, unit="s"),
                "src_ip": src_ip,
                "dst_ip": dst_ip,
                "dst_port": dst_port,
                "protocol": protocol,
                "bytes": len(pkt),
                "latency_ms": latency_ms
            })

    df = pd.DataFrame(rows)
    return df

# Uso
df = pcap_to_dataframe("your_traffic.pcap")
print(df.head())
df.to_csv("traffic_capture.csv", index=False)
