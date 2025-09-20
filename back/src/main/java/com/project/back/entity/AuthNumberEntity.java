package com.project.back.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;


@Entity(name="authNumber")
@Table(name="auth_number")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthNumberEntity 
{
  @Id
  private String telNumber;
  private String authNumber;
}
/* 3차 프로젝트 분석완료 */