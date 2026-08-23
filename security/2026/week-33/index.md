---
title: Security Weekly
edition: 003
week: 33
year: 2026
published: 2026-08-16
last_updated: 2026-08-16
reading_time: 13 min
threat_level: Critical
author: Rodrigo Tripa
version: 1.0
---

# Security Weekly #003

> Weekly cybersecurity intelligence, threat analysis and technical research.

---

# Overview

| Field | Value |
|-------|-------|
| Edition | #003 |
| Week | Week 33 |
| Year | 2026 |
| Published | 2026-08-16 |
| Reading Time | 13 min |
| Threat Level | 🔴 Critical |

---

# Weekly Statistics

| Metric | Value |
|---------|------:|
| Critical CVEs | 4 |
| Actively Exploited Vulnerabilities | 7+ |
| Malware Families | 3 |
| Ransomware Campaigns | 4 |
| Threat Intelligence Reports | 5 |
| Recommended Resources | 8 |

---

# Executive Summary

Week 33 was defined by a simple pattern: attackers continued to move faster than defensive teams can reasonably assume.

The most significant development was the exploitation of Metabase CVE-2026-72898, a critical unauthenticated SQL injection vulnerability carrying a CVSS score of 10.0. The flaw affected the password-reset endpoint and could allow an attacker to obtain administrative access to a Metabase instance and, consequently, interact with data sources connected to it. Several organizations reported incidents associated with the campaign, demonstrating how a business-intelligence platform can become a gateway into much larger data environments.

At the same time, attackers continued targeting infrastructure at the edge of enterprise networks. VMware vCenter exploitation was observed shortly after patches became available, while SonicWall SMA1000 vulnerabilities continued to be abused by ransomware operators. Microsoft SharePoint also remained under attack after a public exploit became available for an authentication-bypass vulnerability. These incidents reinforce a pattern already visible in previous weeks: attackers consistently prioritize systems that provide access to large amounts of data or administrative control.

Microsoft's August security updates added another important dimension. More than four hundred vulnerabilities were addressed, including CVE-2026-68820, a Windows kernel vulnerability exploited by the Lazarus Group. The campaign used malicious software distribution techniques to deploy the FudModule rootkit, demonstrating that exploitation, social engineering, and post-exploitation tooling continue to operate as a single chain rather than as isolated techniques.

Ransomware activity remained equally relevant. CISA and international partners published a joint advisory on Gunra ransomware, describing a double-extortion operation that combines data theft with encryption. Other groups continued exploiting exposed remote-access infrastructure and stolen credentials. The result is a threat landscape where vulnerability management, identity security, and incident response can no longer be treated as separate defensive disciplines.

The most important lesson from Week 33 is therefore not a particular CVE. It is the shrinking time between vulnerability disclosure, exploit development, and operational attacks.

---

# Threat Landscape

The threat landscape during Week 33 was concentrated around three attack surfaces: externally exposed infrastructure, identity, and applications with access to sensitive data.

The Metabase incident is a particularly clear example. Metabase is not normally considered a security-control system, yet a compromise can expose information from databases connected to the platform. The security impact therefore extends beyond the vulnerable application itself.

This same principle appears in VMware vCenter, SharePoint, SonicWall and similar enterprise platforms. These systems occupy strategic positions inside an organization. Compromising them provides attackers with leverage that is disproportionate to the individual vulnerability.

The result is a threat model in which defenders need to evaluate not only whether software is vulnerable, but also what that software can reach if it is compromised.

---

# Critical Vulnerabilities

## CVE-2026-72898

| Field | Value |
|-------|-------|
| Severity | Critical |
| CVSS | 10.0 |
| Vendor | Metabase |
| Product | Metabase |
| Exploited in the Wild | Yes |
| Public PoC | Yes |
| CISA KEV | Yes |

### Description

CVE-2026-72898 is an unauthenticated SQL injection vulnerability in Metabase.

The vulnerability affects the password-reset functionality and allows an attacker to inject SQL without first authenticating to the application.

### Technical Details

The vulnerable endpoint processes attacker-controlled input in a way that permits SQL injection.

Successful exploitation can allow an attacker to manipulate the Metabase application database and obtain administrative access.

The real danger appears after authentication is bypassed. Metabase installations frequently connect to production databases and analytics systems, meaning compromise of the BI platform may expose data beyond the application itself.

### Impact

Potential consequences include:

- Administrative compromise of Metabase.
- Exposure of database credentials.
- Access to connected data sources.
- Data theft.
- Manipulation of dashboards and queries.
- Secondary compromise of connected infrastructure.

### Mitigation

Self-hosted Metabase installations should be upgraded immediately to a patched version.

Organizations should also rotate credentials accessible from the affected instance and investigate database access logs for suspicious queries or authentication activity.

Internet exposure should be minimized wherever possible.

---

## CVE-2026-68820

| Field | Value |
|-------|-------|
| Severity | High |
| Vendor | Microsoft |
| Product | Windows Ancillary Function Driver for WinSock |
| Exploited in the Wild | Yes |
| Public PoC | Yes |
| CISA KEV | Yes |

### Description

CVE-2026-68820 is a Windows privilege-escalation vulnerability exploited by the Lazarus Group.

Microsoft addressed the flaw in the August security updates.

### Impact

The vulnerability provides attackers with a path toward elevated privileges after initial execution.

The Lazarus campaign combined exploitation with malicious software delivery and deployment of the FudModule rootkit.

This illustrates an important distinction: a privilege-escalation vulnerability does not necessarily provide initial access, but once an attacker has execution it can dramatically increase the consequences of compromise.

### Mitigation

Apply Microsoft's August security updates and monitor endpoints for suspicious driver activity, privilege escalation and unexpected kernel-level components.

Organizations should also investigate systems exposed to known Lazarus phishing or malware-delivery campaigns.

---

## VMware vCenter Server Vulnerabilities

VMware vCenter remained a high-value target during the week as threat actors began exploiting critical vulnerabilities shortly after patches became available.

The activity demonstrates the decreasing window available for organizations to test and deploy emergency patches.

vCenter is particularly sensitive because it provides centralized control over virtual infrastructure. Compromise can therefore provide an attacker with access to multiple virtual machines and potentially the management plane of an entire environment.

Organizations should treat Internet-exposed vCenter installations as a priority and investigate suspicious authentication and management activity before and after patching.

---

## Microsoft SharePoint CVE-2026-55040

CVE-2026-55040 is an authentication-bypass vulnerability affecting SharePoint's JWT token validation pipeline.

Following the publication of a proof of concept, exploitation was observed in real attacks.

Successful exploitation can allow an attacker to impersonate users and perform actions against SharePoint resources.

The incident demonstrates once again why public proof-of-concept code substantially changes the risk profile of an already disclosed vulnerability.

Organizations running on-premises SharePoint should confirm that the July security updates were installed and investigate suspicious access to sensitive sites, documents and administrative functions.

---

# Active Exploitation

The most important exploited vulnerabilities during Week 33 were:

- Metabase CVE-2026-72898.
- Windows CVE-2026-68820.
- VMware vCenter vulnerabilities.
- Microsoft SharePoint CVE-2026-55040.
- SonicWall SMA1000 CVE-2026-15409 and CVE-2026-15410.
- Progress LoadMaster CVE-2026-8037.

The common characteristic is strategic positioning.

These are not random desktop applications. They are management platforms, remote-access gateways, application servers, virtualization infrastructure, or systems containing access to valuable data.

This concentration should influence vulnerability prioritization. A vulnerability with moderate theoretical severity can deserve immediate remediation when it exists inside a critical control plane.

---

# Threat Intelligence

## Lazarus Group

Lazarus continued to demonstrate a combination of social engineering, vulnerability exploitation and advanced post-exploitation tooling.

The exploitation of CVE-2026-68820 was particularly notable because the campaign used a Windows kernel vulnerability to assist deployment of the FudModule rootkit.

The operation demonstrates the value of layered attack chains. Initial compromise does not need to immediately provide full control when attackers have reliable methods for escalating privileges afterward.

---

## AI-Assisted Operations

AI remained one of the most discussed developments in offensive security.

The important change is not simply that threat actors are using language models. The more consequential development is the use of AI systems as operational components capable of interacting with tools, interpreting results and continuing multi-step workflows.

This creates a new category of risk.

Traditional automation executes predefined instructions. Agentic systems can potentially select subsequent actions based on the environment they observe.

For defenders, this means security controls around AI systems must include strict permissions, network segmentation, logging and human approval for high-impact actions.

---

# Malware

## FudModule

FudModule is a sophisticated Windows rootkit associated with Lazarus operations.

Its relevance during Week 33 comes from its use after exploitation of the Windows kernel vulnerability CVE-2026-68820.

The malware operates at a level that makes traditional user-space detection more difficult.

Defenders should therefore monitor for unusual driver activity, kernel modifications, suspicious privilege transitions and known indicators associated with Lazarus campaigns.

---

## Lumma Stealer

Lumma Stealer remained active during the week through malicious downloads and deceptive distribution campaigns.

Information stealers remain strategically important because stolen browser credentials, session tokens and authentication material can provide attackers with access without requiring a traditional exploit.

Credential theft therefore continues to be one of the most reliable bridges between initial compromise and ransomware deployment.

---

# Ransomware

Ransomware activity remained strong during Week 33.

CISA, the FBI and international partners released a joint advisory on Gunra ransomware, describing the group's double-extortion model. Gunra encrypts systems while also stealing sensitive information, creating pressure through both operational disruption and threatened disclosure.

Other ransomware operators continued exploiting exposed remote-access infrastructure, including SonicWall appliances.

The important trend is that ransomware operations increasingly combine multiple techniques:

1. Credential theft or vulnerability exploitation.
2. Initial access.
3. Privilege escalation.
4. Lateral movement.
5. Data exfiltration.
6. Security-control evasion.
7. Encryption or extortion.

Defenders should therefore avoid designing ransomware detection around the final encryption stage. By that point, most of the intrusion has already happened.

---

# Blue Team

The defensive priority for Week 33 is reducing the time between vulnerability disclosure and remediation.

Organizations should identify all externally exposed instances of:

- Metabase.
- VMware vCenter.
- SharePoint.
- SonicWall SMA1000.
- Progress LoadMaster.

Patching should be followed by validation. Security teams should confirm that vulnerable versions are no longer exposed and investigate whether exploitation occurred before remediation.

Identity security should receive equal attention.

Organizations should enforce MFA for privileged accounts, rotate credentials following suspected compromise, monitor authentication anomalies and reduce the number of systems capable of performing administrative actions.

For ransomware defense, endpoint detection should be supplemented by network and identity telemetry. Detecting abnormal authentication, lateral movement and large-scale data access can provide defenders with hours or days of additional response time.

---

# Red Team

Week 33 provides several useful lessons for offensive security.

A mature external assessment should not stop at conventional web applications. High-value management interfaces such as vCenter, remote-access gateways, SharePoint and BI platforms can represent more valuable targets.

The Metabase vulnerability is a particularly good example. The vulnerable application itself may not contain the most valuable information. Its importance comes from the databases and credentials surrounding it.

Red teams should therefore map trust relationships and connected assets rather than assessing vulnerabilities in isolation.

---

# Cloud Security

The Metabase incident demonstrates a recurring cloud-security problem: an application can become a bridge between an external attacker and internal data services.

Organizations should evaluate every internet-facing SaaS or self-hosted application according to the privileges and data sources available to it.

Secrets should not be stored unnecessarily inside application environments, and service accounts should have narrowly defined permissions.

Network segmentation should also prevent a compromised application from freely reaching every internal database.

---

# Linux Security

Linux-hosted infrastructure remained heavily represented in the week's attack surface through products such as Metabase, VMware infrastructure components and application servers.

The main lesson is that operating-system hardening does not compensate for vulnerable application-layer services.

A hardened Linux server running an internet-exposed vulnerable application can still become an initial-access point.

Linux security therefore requires a complete stack:

- Kernel security.
- Package management.
- Application patching.
- Service isolation.
- Network controls.
- Authentication.
- Logging.
- Egress monitoring.

---

# Active Directory

Identity continued to play a central role in ransomware and intrusion operations.

Even when attackers begin with an application vulnerability, their next objective is often credential acquisition and privilege escalation.

Organizations should therefore protect privileged identities as carefully as externally exposed infrastructure.

Particular attention should be given to:

- Domain administrators.
- Service accounts.
- Remote-management accounts.
- Cloud synchronization identities.
- Accounts with access to backup infrastructure.

---

# AI Security

AI security is increasingly becoming an operational security discipline.

During Week 33, discussion around autonomous AI attacks demonstrated that the primary risk is not necessarily a malicious model. The risk can emerge when an otherwise legitimate model is given excessive permissions and access to external tools.

An AI agent capable of reading files, executing commands, accessing APIs and making network requests becomes a privileged software component.

The security model should therefore resemble that used for other privileged automation:

- Least privilege.
- Explicit tool permissions.
- Network segmentation.
- Strong authentication.
- Detailed audit logs.
- Human approval for destructive actions.
- Isolation of sensitive credentials.

AI systems should not be trusted merely because they are designed for defensive or administrative purposes.

---

# Analysis

Week 33 represents a shift from individual vulnerabilities toward a broader question of control.

Metabase, VMware vCenter, SharePoint and SonicWall are different technologies, but their strategic value is similar. They sit between users and important resources, or between administrators and the systems they control.

That makes them control points.

The attacker does not necessarily need to compromise every endpoint if one of these systems can provide access to hundreds of them. Likewise, stealing credentials from a single privileged application can be more valuable than deploying malware across dozens of ordinary workstations.

The Metabase incident illustrates the same principle from a data perspective. The vulnerable application becomes dangerous because of everything connected to it.

This is why CVSS alone is not enough for prioritization. Security teams should combine vulnerability severity with exposure, exploitability, privilege, connectivity and business impact.

The second major lesson is the shrinking exploitation window. Metabase moved from disclosure to public exploitation extremely quickly. SharePoint exploitation followed the publication of a proof of concept, while VMware infrastructure was attacked shortly after patches became available.

The traditional cycle of "read advisory, test patch, schedule maintenance" is becoming increasingly difficult to sustain for internet-facing systems.

The defensive model must therefore become more adaptive.

Asset inventory, exposure management, threat intelligence and incident response need to operate as a single process rather than separate departments.

---

# Key Takeaways

- Metabase CVE-2026-72898 became one of the week's most dangerous vulnerabilities, with CVSS 10.0 and active exploitation.
- Lazarus exploited a Windows kernel vulnerability and deployed the FudModule rootkit.
- VMware vCenter and Microsoft SharePoint were actively targeted.
- SonicWall vulnerabilities continued to be exploited by ransomware operators.
- Gunra demonstrated the continued evolution of double-extortion ransomware.
- Credential theft remains as important as vulnerability exploitation for ransomware operations.
- Management and data-access platforms deserve higher priority than their raw CVSS score may suggest.
- AI agents introduce a new security problem when they are given broad tool and network access.
- The gap between disclosure and exploitation continues to shrink.

---

# References

- CISA Known Exploited Vulnerabilities Catalog
- CISA / FBI #StopRansomware: Gunra Ransomware
- Microsoft Security Response Center — August 2026 Security Updates
- Microsoft Security Intelligence
- Metabase Security Advisory — CVE-2026-72898
- VMware Security Advisories
- Microsoft SharePoint Security Advisories
- SonicWall PSIRT
- Progress Security Advisories
- BleepingComputer
- SecurityWeek
- The Hacker News
- Cyware
- Bitdefender Threat Intelligence

---

# Editorial Notes

## Writing Guidelines

- Prioritise technical accuracy.
- Avoid sensationalism.
- Explain context, not only facts.
- Prefer primary sources whenever possible.
- Clearly distinguish facts from personal analysis.
- Keep terminology consistent.
- Use concise, professional language.
- Omit sections with no meaningful developments.
- Verify every CVE before publication.
- Verify exploit status before claiming active exploitation.
- Review grammar and formatting before publishing.

---

_End of Report_